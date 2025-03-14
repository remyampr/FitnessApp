const transporter=require("../../Config/nodemailer");

const sendEmail=async (to,subject,html)=>{
    try {
        console.log(":email sending .....");
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        }
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error("Email sending error:", error);
    }
}

module.exports = sendEmail;