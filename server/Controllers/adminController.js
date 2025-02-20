const Admin = require("../Models/Admin");
const Trainer = require('../Models/Trainer');
const User=require("../Models/User");
const { hashPassword,comparePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const sendEmail=require("../Config/emailService")
const generateOTP=require("../Utilities/generateOTP");



const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ Error: "All fields are required !" });
    }
    const adminExist = await Admin.findOne({});
    if (adminExist) {
      return res.json({ Error: "admin already exist" });
    }
    const hashedPassword =await hashPassword(password);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    const saved = await admin.save();
    if (saved) {
      const token = createToken(saved._id, saved.role);
      res.cookie("token",token)
      return res.json({ msg: "Admin created " ,token:token});
    }
  } catch (err) {
    next(err);
  }
};
const loginAdmin = async (req, res, next) => {
  try {
    const {email,password}=req.body;
    if ( !email || !password) {
        return res.json({ Error: "All fields are required !" });
      }
    const admin=await Admin.findOne({email});
    if(!admin){
        return res.json({ Error: "admin not found" });
    }
    const passwordMatch=await comparePassword(password,admin.password);
    console.log(passwordMatch);
    if(!passwordMatch){
        return res.status(400).json({error:"Password not match"})
    }
    const token=createToken(admin._id,admin.role);
    res.cookie("token",token)
    console.log("Admin login")
    res.status(200).json({msg:"Admin Login",token:token})


  } catch (err) {
    next(err);
  }
};

const logout=async(req,res,next)=>{
  try {
    res.clearCookie("token")
    res.status(200).json({msg:"logout"})
  } catch (error) {
    next(error)
  }
}

const forgotPassword =async(req,res,next)=>{
  try {
    const {email}=req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const admin=await Admin.findOne({email})
    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    }

    const otp=generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    admin.otp=otp;
    admin.otpExpires=otpExpires;
    await admin.save();
    

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

      const admin = await admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ error: "admin not found" });
      }

      if(admin.otp !== otp || admin.otpExpires < Date.now()){
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      admin.password=await hashPassword(newPassword);
      admin.otp = undefined;
      admin.otpExpires = undefined;
      await admin.save();

      res.json({ msg: "Password reset successful!" });


  } catch (error) {
    next(error)
  }
}


// Trainer mangement

const getAllTrainers=async(req,res,next)=>{
  try {
    const trainers=await Trainer.find({}).select("-password"); ;
    if(!trainers){
      return res.status(401).json({error:"Empty!"})
    }
    res.status(200).json({ success: true, trainers });

    
  } catch (error) {
    next(error)
  }
}
const getTrainer=async(req,res,next)=>{
  try {

    const { id } = req.params;
    const trainer = await Trainer.findById(id).select("-password");

    if (!trainer) {
      return res.status(404).json({ error: "trainer not found" });
    }

    res.status(200).json(trainer);

    
  } catch (error) {
    next(error)
  }
}
const updateTrainer=async(req,res,next)=>{
  try {
    const { id } = req.params; 

    const updatedTrainer = await Trainer.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true, 
    }).select("-password"); 

    if (!updatedTrainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    
    res.status(200).json({ msg: "Trainer updated successfully", Trainer: updatedTrainer });
    
  } catch (error) {
    next(error)
  }
}
const deleteTrainer=async(req,res,next)=>{
  try {
    
    const { id } = req.params;

    const deletedTrainer = await Trainer.findByIdAndDelete(id);

    if (!deletedTrainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    res.status(200).json({ msg: "Trainer deleted successfully" });
    
  } catch (error) {
    next(error)
  }
}

const  getUnapprovedTrainers=async(req,res,next)=>{
  try {

    const trainers = await Trainer.find({ isCertified: false });
    if(!trainers || trainers.length === 0){
      return res.status(401).json({error:"No unapproved trainers found!"})
    }

    const trainerDetails = trainers.map(trainer => ({
      name: trainer.name,
      email: trainer.email,
      specialization:trainer. specialization,
      experience: trainer.experience,
      certifications:trainer.certifications,
    
    }));
    res.status(200).json({ success: true,  trainers: trainerDetails  });
    
  } catch (error) {
    next();
  }
}

const  approveTrainer=async(req,res,next)=>{
  try {

    const { trainerId } = req.body;
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.isCertified = true;
    await trainer.save();

    res.status(200).json({ success: true, message: 'Trainer approved', trainer });

  } catch (error) {
    next();
  }
}


const getAllUsers=async(req,res,next)=>{

  try {
    const users= await User.find({});
    if(!users){
      return res.status(401).json({error:"Empty!"})
    }
    res.status(200).json({ success: true, users });


  } catch (error) {
    next(error)
  }
  
}

const getUser=async(req,res,next)=>{
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);


  } catch (error) {
    next(error)
  }

}

const updateUser=async(req,res,next)=>{

  try {

    const { id } = req.params; 

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true, 
    }).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ msg: "User updated successfully", user: updatedUser });
    
  } catch (error) {
    next(error)
  }

}

const deleteUser=async(req,res,next)=>{

  try {

    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
    
  } catch (error) {
    next(error)
  }

}














module.exports = { createAdmin,loginAdmin,logout, getUnapprovedTrainers,approveTrainer,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllTrainers,getTrainer,updateTrainer,deleteTrainer,

 };
