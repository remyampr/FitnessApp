const User=require("../Models/User");
const Trainer=require("../Models/Trainer")
const { hashPassword,comparePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const uploadToCloudinary = require("../Utilities/imageUpload");
const crypto=require("crypto");
const sendEmail=require("../Config/emailService")
const {generateOTP}=require("../Utilities/generateOTP");
const { cloudinary_js_config } = require("../Config/cloudinaryConfig");
const { log } = require("console");


const registerUser=async (req,res,next)=>{
    try{
        const {name,email,password}=req.body;
        if (!name || !email || !password) {
            return res.status(401).json({ error: "All fields are required !" });
          }
        const userExist=await User.findOne({email});
        if(userExist){
            console.log(userExist)
           return res.status(401).json({error:"User already exist!"})
        }

        const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

        const hashedPassword=await hashPassword(password);
        const newUser=new User({
            name,email,password:hashedPassword,  otp,
            otpExpires,
        });
        await newUser.save()

        const emailContent = `
        <h2>Email Verification</h2>
        <p>Use this OTP to verify your email: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
      await sendEmail(email, "Verify Your Email", emailContent);
  
      return res.status(201).json({
        message: "User registered. Please verify your email.",user: newUser });


        // if(newUser){
        //     const token=createToken(newUser._id,newUser.role);
        //     res.cookie("token",token);
        //     return res.status(201).json({msg:"New user Registered",newUser});
        // }


    }catch(err){
        next(err);
    }
}

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  // user.otp = undefined;
  // user.otpExpires = undefined;

  user.set({ otp: undefined, otpExpires: undefined });
  await user.save();

  const token=createToken(user._id,user.role);
  res.cookie("token",token);
  console.log("uerlogin");

  return res.json({ msg: "Email verified successfully!",user:user });
};


const forgotPassword =async(req,res,next)=>{
  try {
    const {email}=req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user=await User.findOne({email})
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp=generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    user.otp=otp;
    user.otpExpires=otpExpires;
    await user.save();
    

    console.log(`Reset OTP for ${email}: ${otp}`); 
    const emailContent = `
    <h2>Email Verification</h2>
    <p>Use this OTP reset your Password <strong>${otp}</strong></p>
    <p>This OTP will expire in 10 minutes.</p>
  `;
  await sendEmail(email, "Verify Your Email", emailContent);

    res.status(201).json({ msg: "OTP sent to your email", });


  } catch (error) {
    next(error)
  }
}

const resetPassword=async(req,res,next)=>{
  try {
    
      const {email,otp,newPassword}=req.body;
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: "Email, OTP, and new password are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if(user.otp !== otp || user.otpExpires < Date.now()){
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      user.password=await hashPassword(newPassword);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.json({ msg: "Password reset successful!" });


  } catch (error) {
    next(error)
  }
}




const loginUser=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({ error: "All fields are required !" });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({ error: "User not Found !" });
        }

        const passwordMatch=await comparePassword(password,user.password);
        if(!passwordMatch){
            return res.status(400).json({ error: "Password not match !" });
        }

        const token=createToken(user._id,user.role);
        res.cookie("token",token);
        console.log("uerlogin");

        // user.password = undefined;


        if (!user.isProfileCompleted) {
          return res.status(200).json({
            message: "User login successful, but profile is incomplete.",
            isProfileCompleted: false,
            user,
          });
        }
        
        return res.json({
          message: "User login successful",
          
          isProfileCompleted: true,
          user,
        }); //should exclude password?
    }catch(err){
        next(err);
    }
}

const logout=async(req,res,next)=>{
    try {
      res.clearCookie("token")
      console.log("log Out");
      res.status(200).json({message:"logout"})
    } catch (error) {
      next(error)
    }
  }

  const getCertifiedTrainers = async (req, res, next) => {
    try {
      const trainers = await Trainer.find({ isCertified: true });
      console.log("Crtified trainers : ",trainers);
      

      if (!trainers || trainers.length === 0) {
        return res.status(404).json({ success: false, message: 'No certified trainers found' });
      }
       // Send certified trainers to the frontend
      res.status(200).json({ success: true, trainers });

      
    } catch (error) {
      next();
    }
  }

  const assignTrainer = async (req, res, next) => {
try {

  console.log("Request body:", req.body);

  const user = await User.findById(req.user.id);

    if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { trainerId } = req.body;
  console.log("Trainer Id from req.body : ",trainerId);
  

  const trainer = await Trainer.findById(trainerId);
  console.log("User selected trainer : ",trainer);
  

  if(!trainer){
    return res.status(400).json({ error: 'No Trainer Avilable' });
  }

    if (trainer.isCertified !== true) {
      return res.status(400).json({ error: 'Trainer must be certified' });
    }
  
    user.trainerId = trainerId;
    await user.save();


    // const subscriptionAmount = user.subscription.amount;  
    // const trainerShare = (subscriptionAmount * 0.30); 

    // trainer.totalRevenue += trainerShare;
    // await trainer.save();


    res.status(200).json({ success: true, message: 'Trainer assigned successfully Proceed to payment',paymentRequired:true, user });

} catch (error) {
  next(error)
}
  }


  const updateUserProfile = async (req, res, next) => {
try {
    const user=await User.findById(req.user.id);
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { phone,height, weight, age, gender, fitnessGoal } = req.body;
    //   if(!phone || !trainerId || !height || !weight || !age || !gender || !fitnessGoal){
    //     return res.json({ Error: "All fields are required !" });
    //   }

      let image = req.file ? req.file.path : 'Uploads/user.jpg'; 

      if (image !== 'uploads/user.jpg') {
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
      const userUpdated=await user.save();
      if(!user.subscription || user.subscription !== "Active"){
        console.log("user aftetr updating profile : ",userUpdated)
        return res.status(200).json({message:"Basic Profile set up done  Proceed to select trainer ", 
            userUpdated,})
          
      }

    

    res.status(200).json({ msg: "Profile updated successfully", userUpdated });
    
} catch (error) {
    next(error)
}  

}
const getUserProfile = async (req, res, next) => {

    try {
        // Extract user ID from request (from authentication middleware)
        const userId = req.user.id; 
        const user = await User.findById(userId).select("-password"); 
        if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
          res.status(200).json({
            msg: "User profile :",
            user
          });

}
catch (error) {
    next(error);
  }
}

const myTrainer=async(req,res,next)=>{
  try {
    const user=await User.findById(req.user.id).populate("trainerId");
    console.log("uer ,",user.name);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.trainerId) {
      return res.status(404).json({ error: "No trainer assigned to this user" });
    }

    res.status(200).json({ trainer: user.trainerId });
    
  } catch (error) {
    next(error);
  }
}

const rateTrainer = async (req, res, next) => {
  try {

    const { trainerId, rating, comment } = req.body;
    const userId = req.user.id; 

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
  }

// Check if the user has already rated this trainer
const existingReview = trainer.reviews.find(review => review.userId.toString() === userId);
if (existingReview) {
    return res.status(400).json({ error: "You have already rated this trainer" });
}

// Add new review
trainer.reviews.push({ userId, rating, comment });
     // Calculate new average rating
     const totalRatings = trainer.reviews.length;
     const sumRatings = trainer.reviews.reduce((acc, review) => acc + review.rating, 0);
     trainer.averageRating = sumRatings / totalRatings;

     await trainer.save();
     res.status(200).json({ msg: "Trainer rated successfully", trainer });



    
  } catch (error) {
    next(error)
  }

}




module.exports={registerUser,loginUser,
  logout,updateUserProfile,
  getUserProfile,getCertifiedTrainers
  ,assignTrainer,
verifyEmail,
forgotPassword,
resetPassword,myTrainer
}