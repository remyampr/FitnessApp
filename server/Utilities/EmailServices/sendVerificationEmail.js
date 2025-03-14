const sendEmail = require("./sendEmail");

const sendVerificationEmail = async (user, otp) => {
    const subject = "Your Verification Code";
  const html = `
    <p>Dear ${user.name},</p>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>Please enter this code to verify your account.</p>
  `;

  await sendEmail(user.email, subject, html);
}

module.exports = sendVerificationEmail;