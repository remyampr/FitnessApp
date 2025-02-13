const User=require("../Models/User");
const { hashPassword,comparePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const uploadToCloudinary = require("../Utilities/imageUpload");


const registerUser=async (req,res,next)=>{
    try{

        const {name,email,password}=req.body;
        if (!name || !email || !password) {
            return res.json({ Error: "All fields are required !" });
          }
        const userExist=await User.findOne({email});
        if(userExist){
            console.log(userExist)
           return res.status(401).json({error:"User already exist!"})
        }
        const hashedPassword=await hashPassword(password);
        const newUser=new User({
            name,email,password:hashedPassword
        });
        await newUser.save()
        if(newUser){
            const token=createToken(newUser._id,newUser.role);
            res.cookie("token",token);
            return res.status(201).json({msg:"New user Registered",newUser});
        }


    }catch(err){
        next(err);
    }

}
const loginUser=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.json({ Error: "All fields are required !" });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({ Error: "User not Found !" });
        }

        const passwordMatch=await comparePassword(password,user.password);
        if(!passwordMatch){
            return res.json({ Error: "Password not match !" });
        }

        const token=createToken(user._id,user.role);
        res.cookie("token",token);
        console.log("uerlogin");
        
        return res.json({ msg: "User Login",user:{name:user.name,email:user.email,Role:user.role} });
    }catch(err){
        next(err);
    }
}

const logout=async(req,res,next)=>{
    try {
      res.clearCookie("token")
      console.log("log Out");
      res.status(200).json({msg:"logout"})
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
      const { phone, trainerId, height, weight, age, gender, fitnessGoal } = req.body;
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
      if (trainerId) user.trainerId = trainerId;
      if (height) user.height = height;
      if (weight) user.weight = weight;
      if (age) user.age = age;
      if (gender) user.gender = gender;
      if (fitnessGoal) user.fitnessGoal = fitnessGoal;
      user.image = image;

      if(!user.subscription || user.subscription !== "Active"){
        return res.status(200).json({msg:"Trainer assigned Proceed to payment", paymentRequired: true,
            user,})
      }




    await user.save();

    res.status(200).json({ msg: "Profile updated successfully", user });
    
} catch (error) {
    next(error)
}  

}






module.exports={registerUser,loginUser,logout,updateUserProfile}