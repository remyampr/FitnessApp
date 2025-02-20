const Trainer=require("../Models/Trainer");
const User=require("../Models/User")
const { hashPassword,comparePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const uploadToCloudinary = require("../Utilities/imageUpload");
const {generateOTP}=require("../Utilities/generateOTP");
const sendEmail=require("../Config/emailService")


const registerTrainer=async (req,res,next)=>{
    try{

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);
        const { name, email, password, phone, certifications } = req.body;

        let image = req.file ? req.file.path : 'Uploads/user.jpg'; 

        if (!name || !email || !password || !phone || !image || !certifications){
            return res.status(400).json({ error: "All fields are required !" });
          }

          if (image !== 'uploads/user.jpg') {
            const cloudinaryRes = await uploadToCloudinary(image);
            console.log("image in cloudinary : ", cloudinaryRes);
            image = cloudinaryRes;
            }

        const trainerExist=await Trainer.findOne({email});
        if(trainerExist){
           return res.status(401).json({error:"Trainer already exist!"})
        }

      
           const otp = generateOTP();
          const otpExpires = Date.now() + 10 * 60 * 1000; 


        const hashedPassword=await hashPassword(password);
        const newTrainer=new Trainer({
            name,email,password:hashedPassword,phone,image,certifications, isCertified: false, otp,
            otpExpires,
        });
        await newTrainer.save();

        const emailContent = `
        <h2>Email Verification</h2>
        <p>Use this OTP to verify your email: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
      await sendEmail(email, "Verify Your Email", emailContent);
  
      return res.status(201).json({
        msg: "Trainer registered. Please verify your email.",  });


    }catch(err){
        next(err);
    }

}

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const trainer = await Trainer.findOne({ email });

  if (!trainer) {
    return res.status(404).json({ error: "trainer not found" });
  }

  if (trainer.otp !== otp || trainer.otpExpires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  trainer.isVerified = true;
  // trainer.otp = undefined;
  // trainer.otpExpires = undefined;

  trainer.set({ otp: undefined, otpExpires: undefined });
  await trainer.save();

  const token=createToken(trainer._id,trainer.role);
  res.cookie("token",token);
  console.log("trainerlogin");

  return res.json({ msg: "Email verified successfully!" });
};


const forgotPassword =async(req,res,next)=>{
  try {
    const {email}=req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const trainer=await Trainer.findOne({email})
    if (!trainer) {
      return res.status(404).json({ error: "trainer not found" });
    }

    const otp=generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    trainer.otp=otp;
    trainer.otpExpires=otpExpires;
    await trainer.save();
    

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

      const trainer = await Trainer.findOne({ email });
      if (!trainer) {
        return res.status(404).json({ error: "trainer not found" });
      }

      if(trainer.otp !== otp || trainer.otpExpires < Date.now()){
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      trainer.password=await hashPassword(newPassword);
      trainer.otp = undefined;
      trainer.otpExpires = undefined;
      await trainer.save();

      res.json({ msg: "Password reset successful!" });


  } catch (error) {
    next(error)
  }
}




const loginTrainer=async (req,res,next)=>{
    try{

        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({ error: "All fields are required !" });
        }
        const trainer=await Trainer.findOne({email});
        if(!trainer){
            return res.status(400).json({ error: "trainer not Found !" });
        }

        const passwordMatch=await comparePassword(password,trainer.password);
        if(!passwordMatch){
            return res.status(401).json({ error: "Password not match !" });
        }

        const token=createToken(trainer._id,trainer.role);
        res.cookie("token",token);
        return res.json({ msg: "trainer Login",trainer:{name:trainer.name,email:trainer.email,isCertified: trainer.isCertified,Role:trainer.role},token:token});


    }catch(err){
        next(err);
    }

}


const getTrainerRevenue = async (req, res, next) => {
try {

    const trainer = await Trainer.findById(req.user.id).populate('clients');

    if (!trainer) {
        return res.status(404).json({ success: false, message: "Trainer not found" });
      }
      
      res.status(200).json({
        success: true,
        totalRevenue: trainer.totalRevenue,
      });
    
} catch (error) {
    next(error)
}

}


const updateTrainerProfile = async (req, res, next) => {
    try {
        
        const { name, phone, specialization, experience, certifications, availability } = req.body;

        const trainer = await Trainer.findById(req.user.id); 

        if (!trainer) {
            return res.status(404).json({ success: false, message: 'Trainer not found' });
          }

          if (name) trainer.name = name;
          if (phone) trainer.phone = phone;
          if (specialization) trainer.specialization = specialization;
          if (experience) trainer.experience = experience;
          if (certifications) trainer.certifications = certifications;
          if (availability) trainer.availability = availability;
      
       
          if (req.file) {
            trainer.image = req.file.path; 
          }

          await trainer.save();

          res.status(200).json({
            success: true,
            message: 'Trainer profile updated successfully',
            trainer,
          });

    } catch (error) {
        next(error)
    }

}

const getTrainerProfile = async (req, res, next) => {
    try {
      const trainer = await Trainer.findById(req.user.id);
  
      if (!trainer) {
        return res.status(404).json({ success: false, message: 'Trainer not found' });
      }
  
      res.status(200).json({
        success: true,
        trainer: {
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          image: trainer.image,
          specialization: trainer.specialization,
          experience: trainer.experience,
          certifications: trainer.certifications,
          availability: trainer.availability,
          averageRating: trainer.averageRating,
          totalRevenue: trainer.totalRevenue,
          trainerSharePercentage: trainer.trainerSharePercentage,
        }
      });
  
    } catch (error) {
      next(error);
    }
  };
  
// Get all clients of a trainer
const getTrainerClients = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.user.id).populate('clients');
    console.log("Trainer",trainer)

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    res.status(200).json({
      success: true,
      clients: trainer.clients,
    });

  } catch (error) {
    next(error);
  }
};


// Get a specific client by ID
const getClientById = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const trainer = await Trainer.findById(req.user.id).populate('clients');

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const client = trainer.clients.find(client => client._id.toString() === clientId);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found or not assigned to this trainer' });
    }

    // Return the specific client data
    res.status(200).json({
      success: true,
      client,
    });

  } catch (error) {
    next(error);
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


module.exports={registerTrainer,loginTrainer,logout,
    getTrainerRevenue,
    updateTrainerProfile,
    getTrainerProfile,
    getTrainerClients,
    getClientById,
    verifyEmail,
    forgotPassword,
    resetPassword
}