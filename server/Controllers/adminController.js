const Admin = require("../Models/Admin");
const { hashPassword,comparePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");

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



module.exports = { createAdmin,loginAdmin,logout };
