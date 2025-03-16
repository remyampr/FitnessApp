const User = require("../Models/User");
const Trainer = require("../Models/Trainer");
const Payment = require("../Models/Payment");
const { logActivity } = require("../Utilities/activityServices");
const Stripe = require("stripe");
const Admin = require("../Models/Admin");

const stripe = new Stripe(process.env.STRIPE_SECRET);

const paymentFunction = async (req, res, next) => {
  try {
    const {
      trainerId,
      plan,
      amount,
      startDate,
      endDate,
      duration,
      trainerRevenue,
      adminRevenue,
    } = req.body;
    const userId = req.user.id;
    console.log("At payment function recived details !!!!!!!!!!!! :  req.body ", req.body);
    console.log("Inside payment User Id",req.user.id);
    

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Format plan name for Stripe
    const planName =
      plan === "basic" ? "Basic Fitness Plan" : "Premium Fitness Plan";
    const planDuration = duration === 3 ? "3 Month" : "6 Month";
    const planKey = `${plan}_${duration}`;

    // checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${planName} - ${planDuration}`,
              description: `Fitness training with ${trainer.name} for ${duration} months`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      // success_url: `${process.env.FRONTEND_URL}/user/payment-success`,
      success_url: `${process.env.FRONTEND_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription`,
      metadata: {
        userId,
        trainerId,
        plan,
        amount,
        trainerRevenue,
        adminRevenue,
        startDate,
        endDate,
        duration,
      },
    });
console.log("success url : ",session.success_url);

    // Save payment record
    const payment = new Payment({
      userId,
      trainerId,
      amount,
      adminRevenue,
      trainerRevenue,
      plan: planKey,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "Success", 
      transactionId: session.id,
    });

    await payment.save();

    // console.log("Paymentschema Payemnt saved  ::: ", payment);

    // Update User Subscription
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // console.log("User : ",user);
    

    if (!user.paymentHistory) {
      user.paymentHistory = [];
    }

    user.subscription = {
      status: "Active",
      amount,
      plan: planKey,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    user.isProfileComplete = true;
    user.paymentHistory.push({
      transactionId: session.id,
      paymentStatus: "Success",
      amount,
    });

    await user.save();

    // console.log("After payment user userschema: ", user);
    console.log(
      "After payment user.isprofileComplete : ",
      user.isProfileComplete
    );

    // Update Trainer Earnings
    const trainerShare = (trainer.trainerSharePercentage / 100) * amount;
    trainer.totalRevenue += trainerShare;

    trainer.payments.push({
      userId,
      transactionId: session.id,
      amount,
      trainerShare,
      plan: planKey,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      date: new Date(),
    });

    const months = parseInt(duration);
    const monthlyShare = trainerShare / months;

    if (!trainer.revenueHistory) {
      trainer.revenueHistory = [];
    }

    for (let i = 0; i < months; i++) {
      const entryDate = new Date(startDate);
      entryDate.setMonth(entryDate.getMonth() + i);

      const year = entryDate.getFullYear();
      const month = entryDate.getMonth();

      let monthEntry = trainer.revenueHistory.find(
        (entry) => entry.year === year && entry.month === month
      );
      if (monthEntry) {
        monthEntry.revenue += monthlyShare;
        if (i === 0) monthEntry.clientCount = (monthEntry.clientCount || 0) + 1;
      } else {
        trainer.revenueHistory.push({
          year,
          month,
          revenue: monthlyShare,
          clientCount: i === 0 ? 1 : 0,
        });
      }
    }

    if (!trainer.clients.includes(userId)) {
      trainer.clients.push(userId);
    }

    await trainer.save();

  //  console.log("After payment Trainer userschema: ", trainer);

    const admin = await Admin.findOne({ role: "admin" });
    if (admin) {
      const adminShare = amount - trainerShare;
      admin.totalRevenue += adminShare;

      const startDateObj = new Date(startDate);
      const year = startDateObj.getFullYear();
      const month = startDateObj.getMonth();

   

      let monthEntry = admin.revenueHistory.find(
        (entry) => entry.year === year && entry.month === month
      );
      
      if (monthEntry) {
        // Update existing month entry
        monthEntry.revenue += adminShare;
        // If this is a new user, increment newUsers count
        if (user.paymentHistory.length === 1) {
          monthEntry.newUsers = (monthEntry.newUsers || 0) + 1;
        }
        // Track trainer payouts
        monthEntry.trainerPayouts = (monthEntry.trainerPayouts || 0) + trainerShare;
      } else {
        // Create new month entry
        admin.revenueHistory.push({
                    year,
          month,
          revenue: adminShare,
          trainerPayouts: trainerShare,
          newUsers: user.paymentHistory.length === 1 ? 1 : 0,
          newTrainers: 0 // You might want to increment this elsewhere when new trainers join
        });
      }
      admin.userId=userId

      await admin.save();
      // console.log("Admin payment ",admin);
      
    }

    console.log(
      `Payment successful: ${userId} and ${user.name} subscribed to ${plan} for ${duration} months.`
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Subscription activated successfully",
        sessionId: session.id,
      });

    // res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    next(error);
  }
};



const getUserPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "paymentHistory subscription"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      paymentHistory: user.paymentHistory,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  paymentFunction,
  getUserPaymentHistory,

  // createPaymentOrder,
  // confirmPayment,
};
