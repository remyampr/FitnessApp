const User=require("../Models/User");
const Trainer=require("../Models/Trainer");
const Payment = require("../Models/Payment");

const createPaymentOrder = async (req, res, next) => {
  try {
    const { userId, plan,trainerId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ error: "trainer not found" });
    }

    const amount = plan === "Premium" ? 4999 : 1999;

    // Dummy
    const orderId = `order_${userId}_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    const transactionId = `txn_${userId}_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;

    const payment = new Payment({
      userId,
      trainerId,
      amount,
      plan,    
      status: "Pending", // Mark as pending until confirmed
      transactionId,
    });

    await payment.save();

    res.status(200).json({
      message: " Order created successfully",
      orderId,
      transactionId,
      amount,
      currency: "INR",
    });

    // will change to stripe or razorpay later
    // const order = {
    //     id: `order_${userId}_${Date.now()}`,
    //     amount,
    //     currency: "INR",
    //     status: "created",
    //   };
    //   res.status(200).json({
    //     msg: "Order created successfully",
    //     orderId: order.id,
    //     amount,
    //     currency: "INR",
    //   });
  } catch (error) {
    next(error);
  }
};


const confirmPayment = async (req, res, next) => {
    try {
        const { userId, transactionId, paymentStatus } = req.body;

  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      

    // Find the payment record by transactionId
    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }
    const amount=payment.amount;
    const trainerId = payment.trainerId; 
  
    if (paymentStatus === "Success") {
        payment.status = "Completed";
        await payment.save();
  
        // Activate user subscription
        user.subscription.status = "Active";
        user.subscription.amount=amount
        user.subscription.plan = payment.plan;
        user.subscription.startDate = new Date();
        user.subscription.endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        user.isProfileComplete=true;
  
        await user.save();


            // Updating trainer's revenue
      const trainer=await Trainer.findById(trainerId);
      if(trainer){
        const trainerShare = (trainer.trainerSharePercentage / 100) * amount;
        trainer.totalRevenue += trainerShare;

        if (!trainer.clients.includes(userId)) {
          trainer.clients.push(userId);
        }
        await trainer.save();

      }
      
  
        res.status(200).json({ message: "Payment successful, subscription activated", user });
      } else {
        payment.status = "Failed";
        await payment.save();
        res.status(400).json({ error: "Payment failed. Please try again." });
      }
    } catch (error) {
      next(error);
    }
  };

  module.exports={createPaymentOrder,confirmPayment}
