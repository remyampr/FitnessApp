const User = require("../Models/User");
const Admin = require("../Models/Admin");
const Trainer = require("../Models/Trainer");
const sendEmail = require("../Config/emailService");
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const { generateOTP } = require("../Utilities/generateOTP");

const forgotPassword = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    // console.log("Received in Backend:", req.body);
    console.log("recived in backend: ",req.body);
    
    if (!email || !role) {
      console.log(`Email : ${email} , Role : ${role}`);
      
      return res.status(400).json({ error: "Email and role are required" });
    }

    let Model;
    if (role === "admin") Model = Admin;
    else if (role === "trainer") Model = Trainer;
    else if (role === "user") Model = User;
    else return res.status(400).json({ error: "Invalid role" });

    const account = await Model.findOne({ email });
    if (!account) {
      return res.status(404).json({ error: `${role} not found` });
    }

    const otp = generateOTP();

    account.otp = otp;
    account.otpExpires = Date.now() + 10 * 60 * 1000;
    await account.save();

    console.log(`Reset OTP for ${email}: ${otp}`);

    const emailContent = `
        <h2>Password Reset</h2>
        <p>Use this OTP to reset your password: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
    await sendEmail(email, "Reset Your Password", emailContent);

    res.status(201).json({ message: "OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, role, otp, newPassword } = req.body;

    console.log("in resetPassword: ",req.body)


    if (!email || !role || !otp || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, role, OTP, and new password are required" });
    }

    let Model;
    if (role === "admin") Model = Admin;
    else if (role === "trainer") Model = Trainer;
    else if (role === "user") Model = User;
    else return res.status(400).json({ error: "Invalid role" });

    const account = await Model.findOne({ email });
    console.log("name",account.name);
    
    if (!account) {
      return res.status(404).json({ error: `${role} not found` });
    }

    if (account.otp !== otp || account.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    account.password = await hashPassword(newPassword);
    account.otp = undefined;
    account.otpExpires = undefined;
    await account.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp, role } = req.body;
    if (!email || !otp || !role) {
      return res
        .status(400)
        .json({ error: "Email, OTP, and role are required" });
    }

    let Model;
    if (role === "admin") Model = Admin;
    else if (role === "trainer") Model = Trainer;
    else if (role === "user") Model = User;
    else return res.status(400).json({ error: "Invalid role" });

    const account = await Model.findOne({ email });
    if (!account) {
      return res.status(404).json({ error: `${role} not found` });
    }

    if (account.otp !== otp || account.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    account.isVerified = true;
    account.set({ otp: undefined, otpExpires: undefined });
    await account.save();

    const token = createToken(account._id, role);
    res.cookie("token", token, { httpOnly: true });

    console.log("User login successful");

    return res.json({ msg: "Email verified successfully!", user: account });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    console.log("log Out");
    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    console.log("Received from frontend:",req.body)

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Email, password, and role are required!" });
    }

    let model;
    if (role === "admin") model = Admin;
    else if (role === "user") model = User;
    else if (role === "trainer") model = Trainer;
    else {
      return res.status(400).json({ error: "Invalid role" });
    }

    console.log("Role : ",role,"model : ",model);
    

    const user = await model.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: `${role} not found` });
    }

    const passwordMatch = await comparePassword(password,user.password);
    if (!passwordMatch) {
        return res.status(400).json({ error: "Password does not match" });
      }

      const token = createToken(user._id, user.role);
      // res.cookie("token", token, { httpOnly: true });


      res.cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "None",
        path: "/"
    });

    //       res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",  // Secure only in production
    //     sameSite: "None",
    //     path: "/"
    // });

      console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful`);
      console.log(`isprofilecompleted? ${user.isProfileComplete}`);
  
// for user  update last login and check profile completion
      if(role === "user"){
        user.lastLogin=new Date();
        await user.save();
        if (!user.isProfileComplete) {
            return res.status(200).json({
              message: "User login successful, but profile is incomplete.",
              isProfileCompleted: false,
              user,
            });
          }
      }

      return res.status(200).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`, token,user });


  } catch (error) {
    next(error);
  }
};

module.exports = { forgotPassword, resetPassword, verifyEmail,login, logout };
