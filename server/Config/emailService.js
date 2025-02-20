const nodemailer=require("nodemailer");

const sendEmail=async (to,subject,html)=>{
    try{
        const transporter=nodemailer.createTransport({
            service: "gmail", //  provider
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // App password
              },
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
          };
          await transporter.sendMail(mailOptions);
          console.log("Verification email sent!");
    } catch (error) {
        console.error("Email sending error:", error);
      }
}

module.exports = sendEmail;