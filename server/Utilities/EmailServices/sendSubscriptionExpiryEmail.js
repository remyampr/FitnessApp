const sendEmail = require("./sendEmail");


const sendSubscriptionExpiryEmail = async (user) => {
    const subject = "Your Subscription Has Expired";
    const html = `
      <p>Dear ${user.name},</p>
      <p>Your subscription has expired on ${user.subscription.endDate.toDateString()}.</p>
      <p>Please renew your subscription to continue enjoying our services.</p>
      <a href="http://localhost:5173/user/login">Renew Now</a>
      <p>Thank you!</p>
    `;
  
    await sendEmail(user.email, subject, html);
  };

  module.exports = sendSubscriptionExpiryEmail;