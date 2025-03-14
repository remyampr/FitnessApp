const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", //  provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password
  },
});

module.exports = transporter;
