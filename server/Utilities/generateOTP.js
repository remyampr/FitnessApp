const crypto=require("crypto");

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};



module.exports={generateOTP}