const User = require("../Models/User");
const Trainer = require("../Models/Trainer");
const Payment = require("../Models/Payment");
const { logActivity } = require("../Utilities/activityServices");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET);



const paymentFunction = async (req, res, next) => {
  try {
    const { trainerId, plan, amount, startDate, endDate, duration,trainerRevenue,adminRevenue } = req.body;
    const userId = req.user.id;

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Format plan name for Stripe
    const planName =
      plan === "basic" ? "Basic Fitness Plan" : "Premium Fitness Plan";
    const planDuration = duration === 3 ? "3 Month" : "6 Month";

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

    // Save payment record
    const payment = new Payment({
      userId,
      trainerId,
      amount,
      adminRevenue,
      trainerRevenue,
      plan: `${plan}_${duration}`,
      status: "Completed", // Assuming the payment is successful
      transactionId: session.id,
    });

    await payment.save();

    // Update User Subscription
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.subscription = {
      status: "Active",
      amount,
      plan: `${plan}_${duration}`,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    user.isProfileComplete = true;
    await user.save();

    // Update Trainer Earnings
    const trainerShare = (trainer.trainerSharePercentage / 100) * amount;
    trainer.totalRevenue += trainerShare;

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
        if (i === 0)
          monthEntry.clientCount = (monthEntry.clientCount || 0) + 1;
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


    console.log(`Payment successful: ${userId} subscribed to ${plan} for ${duration} months.`);

    res.status(200).json({success: true, message: "Subscription activated successfully" ,sessionId: session.id });

    // res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    next(error);
  }
};

// const stripeWebhookHandler = async (req, res, next) => {
//   let event;
//   try {
//     const sig = req.headers["stripe-signature"];
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const { userId, trainerId, plan, amount, startDate, endDate, duration } =
//       session.metadata;

//     try {
//       const user = await User.findById(userId);
//       if (!user) return res.status(404).json({ error: "User not found" });

//       const trainer = await Trainer.findById(trainerId);
//       if (!trainer) return res.status(404).json({ error: "Trainer not found" });

//       // Save payment record
//       const payment = new Payment({
//         userId,
//         trainerId,
//         amount,
//         plan: `${plan}_${duration}`,
//         status: "Completed",
//         transactionId: session.id,
//       });

//       await payment.save();

//       // Update User Subscription
//       user.subscription = {
//         status: "Active",
//         amount,
//         plan: `${plan}_${duration}`,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//       };
//       user.isProfileComplete = true;
//       await user.save();

//       // Update Trainer Earnings
//       const trainerShare = (trainer.trainerSharePercentage / 100) * amount;
//       trainer.totalRevenue += trainerShare;

//       const months = parseInt(duration);
//       const monthlyShare = trainerShare / months;

//       if (!trainer.revenueHistory) {
//         trainer.revenueHistory = [];
//       }

//       for (let i = 0; i < months; i++) {
//         const entryDate = new Date(startDate);
//         entryDate.setMonth(entryDate.getMonth() + i);

//         const year = entryDate.getFullYear();
//         const month = entryDate.getMonth();

//         let monthEntry = trainer.revenueHistory.find(
//           (entry) => entry.year === year && entry.month === month
//         );
//         if (monthEntry) {
//           monthEntry.revenue += monthlyShare;
//           if (i === 0)
//             monthEntry.clientCount = (monthEntry.clientCount || 0) + 1;
//         } else {
//           trainer.revenueHistory.push({
//             year,
//             month,
//             revenue: monthlyShare,
//             clientCount: i === 0 ? 1 : 0,
//           });
//         }
//       }
//       if (!trainer.clients.includes(userId)) {
//         trainer.clients.push(userId);
//       }
//       await trainer.save();

//       console.log(`Payment successful: ${userId} subscribed to ${plan} for ${duration} months.`);
//       res.status(200).json({ message: "Subscription activated successfully" });


//     } catch (error) {
//       console.error("Error updating payment details:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }else {
//     console.log(`Unhandled event type: ${event.type}`);
//   }

//   res.status(200).end();
// };

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
