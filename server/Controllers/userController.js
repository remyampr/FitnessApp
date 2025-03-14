const User = require("../Models/User");
const Trainer = require("../Models/Trainer");
const Activity = require("../Models/Activity");
const {
  hashPassword,
  comparePassword,
} = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const uploadToCloudinary = require("../Utilities/imageUpload");
const crypto = require("crypto");
const { generateOTP } = require("../Utilities/generateOTP");
const { cloudinary_js_config } = require("../Config/cloudinaryConfig");
const { log } = require("console");
const { logActivity } = require("../Utilities/activityServices");
const sendEmail = require("../Utilities/EmailServices/sendEmail");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(401).json({ error: "All fields are required !" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log(userExist);
      return res.status(401).json({ error: "User already exist!" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });
    await newUser.save();

    const logedActivity = await logActivity("NEW_USER", newUser._id, "user", {
      name: newUser.name,
      email: newUser.email,
      subscription: newUser.subscription,
    });

    const emailContent = `
        <h2>Email Verification</h2>
        <p>Use this OTP to verify your email: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
    await sendEmail(email, "Verify Your Email", emailContent);

    console.log("nre user and OTP : ", newUser, otp);

    return res.status(201).json({
      message: "User registered. Please verify your email.",
      user: newUser,
    });

    // if(newUser){
    //     const token=createToken(newUser._id,newUser.role);
    //     res.cookie("token",token);
    //     return res.status(201).json({msg:"New user Registered",newUser});
    // }
  } catch (err) {
    next(err);
  }
};

const getApprovedTrainers = async (req, res, next) => {
  try {
    console.log("Searching Approved trainers :..");

    const trainers = await Trainer.find({ isApproved: true });
    console.log("Approved : ", trainers);

    if (!trainers || trainers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No approved trainers found" });
    }
    // Send certified trainers to the frontend
    res.status(200).json({ success: true, trainers });
  } catch (error) {
    next();
  }
};

const assignTrainer = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { trainerId } = req.body;
    console.log("Trainer Id from req.body : ", trainerId);

    const trainer = await Trainer.findById(trainerId);
    console.log("User selected trainer : ", trainer);

    if (!trainer) {
      return res.status(400).json({ error: "No Trainer Avilable" });
    }

    if (trainer.isApproved !== true) {
      return res.status(400).json({ error: "Trainer must be approved" });
    }

    user.trainerId = trainerId;
    await user.save();

    // const subscriptionAmount = user.subscription.amount;
    // const trainerShare = (subscriptionAmount * 0.30);

    // trainer.totalRevenue += trainerShare;
    // await trainer.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Trainer assigned successfully Proceed to payment",
        paymentRequired: true,
        user,
      });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { phone, height, weight, age, gender, fitnessGoal } = req.body;
 

    let image = req.file ? req.file.path : "Uploads/user.jpg";
    console.log("height:............. ",height);
    

    if (image !== "uploads/user.jpg") {
      const cloudinaryRes = await uploadToCloudinary(image);
      console.log("image in cloudinary : ", cloudinaryRes);
      image = cloudinaryRes;
    }

    if (phone) user.phone = phone;
    // if (trainerId) user.trainerId = trainerId;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;
    user.image = image;
    const userUpdated = await user.save();
    if (!user.subscription || user.subscription.status !== "Active") {
      console.log("user aftetr updating profile : ", userUpdated);
      return res
        .status(200)
        .json({
          message: "Basic Profile set up done  Proceed to select trainer ",
          userUpdated,
        });
    }

    res.status(200).json({ msg: "Profile updated successfully", userUpdated });
  } catch (error) {
    next(error);
  }
};
const getUserProfile = async (req, res, next) => {
  try {
    // Extract user ID from request (from authentication middleware)
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password") // Exclude password field
      .populate(
        "trainerId",
        "name image specialization experience email availability certifications bio socialLinks status reviews averageRating"
      )
      .populate("testimonial");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log("inside getuserProfile >> >>>",user);
    
    res.status(200).json({
      msg: "User profile :",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getMyTrainer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("trainerId");
    console.log("user ,", user.name);

    if (!user || !user.trainerId) {
      return res.status(404).json({ message: 'No trainer assigned to this user' });
    }

    const trainer = await Trainer.findById(user.trainerId)
      .populate('reviews.userId', 'name profileImage');

      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }

    res.status(200).json({ trainer});
  } catch (error) {
    next(error);
  }
};

const reviewMyTrainer = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    console.log("req.body : reviewMyTrainer controller !",req.body );
    

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const user = await User.findById(userId);

    if (!user || !user.trainerId) {
      return res.status(404).json({ message: 'No trainer assigned to this user' });
    }

    const trainerId = user.trainerId;
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Check if the user has already reviewed this trainer
    const existingReviewIndex= trainer.reviews.findIndex(
      review => review.userId.toString() === userId
    );

    if (existingReviewIndex !== -1) {
     // Update existing review
     trainer.reviews[existingReviewIndex].rating = rating;
     trainer.reviews[existingReviewIndex].comment = comment;
    }else{
      // new review
      trainer.reviews.push({
        userId,
        rating,
        comment
      })
    }




     // Recalculate average rating
     const totalRating = trainer.reviews.reduce((sum, review) => sum + review.rating, 0);

     trainer.averageRating = totalRating / trainer.reviews.length;

 console.log("Trainer before save:", trainer);
    
    await trainer.save();

    res.status(200).json({ message: 'Review added successfully', trainer });
  } catch (error) {
    next(error);
  }
};

const deleteMyTrainerReview = async (req,res,next)=>{
  try {
    
    const userId=req.user.id;

    const user = await User.findById(userId);
    
    if (!user || !user.trainerId) {
      return res.status(404).json({ message: 'No trainer assigned to this user' });
    }

    const trainerId = user.trainerId;
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

     // Filter out the user's review
     const initialLength = trainer.reviews.length;
     trainer.reviews = trainer.reviews.filter(
       review => review.userId.toString() !== userId
     );
     
     if (trainer.reviews.length === initialLength) {
       return res.status(404).json({ message: 'Review not found' });
     }

      // Recalculate average rating
    if (trainer.reviews.length > 0) {
      const totalRating = trainer.reviews.reduce((sum, review) => sum + review.rating, 0);
      trainer.averageRating = totalRating / trainer.reviews.length;
    } else {
      trainer.averageRating = 5; // Default value if no reviews
    }

    await trainer.save();
    
    res.status(200).json({ 
      message: 'Review deleted successfully',
      trainer});


  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  updateUserProfile,
  getUserProfile,
  getApprovedTrainers,
  assignTrainer,
getMyTrainer,
reviewMyTrainer,
deleteMyTrainerReview
};
