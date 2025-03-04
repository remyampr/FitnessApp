const User=require("../Models/User");
const Trainer=require("../Models/Trainer");
const Payment = require("../Models/Payment");
const { logActivity } = require("../Utilities/activityServices");
const Stripe=require("stripe");

const stripe= new Stripe(process.env.SRTIPE_SECRETE)

const createPaymentOrder = async (req, res, next) => {
  try {
    const { userId, plan,trainerId,duration } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

  


     // Determine amount based on plan and duration
     let amount;
     if (plan === "Premium") {
      amount = duration === "3month" ? 4999 : 8999; // 3-month or 6-month premium
    } else {
      amount = duration === "3month" ? 1999 : 3599; // 3-month or 6-month basic
    }


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
      plan: `${plan}_${duration}`,  
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

    const planParts = payment.plan.split('_');
    const planType = planParts[0]; // "Premium" or "Basic"
    const duration = planParts[1]; // "3month" or "6month"

    const months = duration === "3month" ? 3 : 6;
  
    if (paymentStatus === "Success") {
        payment.status = "Completed";
        await payment.save();
  
        // Activate user subscription
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + months);


        user.subscription.status = "Active";
        user.subscription.amount=amount
        user.subscription.plan = payment.plan;
        user.subscription.startDate = startDate
        user.subscription.endDate = endDate;
        user.isProfileComplete=true;
  
        await user.save();


         // Update trainer's revenue with monthly breakdown
      const trainer=await Trainer.findById(trainerId);
      if(trainer){
        const trainerShare = (trainer.trainerSharePercentage / 100) * amount;
        trainer.totalRevenue += trainerShare;

        const monthlyShare = trainerShare / months; // Divide across months

        if (!trainer.revenueHistory) {
          trainer.revenueHistory = [];
        }

 // Add entries for each month of the subscription
        for (let i = 0; i < months; i++) {
          const entryDate = new Date(startDate);
          entryDate.setMonth(startDate.getMonth() + i);
          
          const year = entryDate.getFullYear();
          const month = entryDate.getMonth();

          // Find existing entry or create new one
          let monthEntry = trainer.revenueHistory.find(
            entry => entry.year === year && entry.month === month
          );
          if (monthEntry) {
            monthEntry.revenue += monthlyShare;
            if (i === 0) monthEntry.clientCount = (monthEntry.clientCount || 0) + 1;
          } else {
            trainer.revenueHistory.push({
              year,
              month,
              revenue: monthlyShare,
              clientCount: i === 0 ? 1 : 0 // Only count client in the first month
            });
          }
        }

        if (!trainer.clients.includes(userId)) {
          trainer.clients.push(userId);
        }
        await trainer.save();

      }

      const logedActivity=await logActivity( "PAYMENT_RECEIVED",payment._id,"Payment",{user:user._id,trainer:trainer._id});

      res.status(200).json({
        message: `Payment successful, ${months}-month subscription activated`,
        user
      });

      } else {
        payment.status = "Failed";
        await payment.save();
        res.status(400).json({ error: "Payment failed. Please try again." });
      }
    } catch (error) {
      next(error);
    }
  };



  const  paymentFunction=async (req,res,next)=>{
    try {

      const { trainerId, plan, amount, startDate, endDate, duration } = req.body;
      const userId = req.user.id;

      const trainer = await Trainer.findById(trainerId)
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }

        // Format plan name for Stripe
    const planName = plan === 'basic' ? 'Basic Fitness Plan' : 'Premium Fitness Plan';
    const planDuration = duration === 3 ? '3 Month' : '6 Month';

     // checkout session
     const session=await stripe.checkout.sessions.create({

      payment_method_types:['card'],
      line_items:[
        {
          price_data:{
            currency: 'inr',
            product_data:{
              name: `${planName} - ${planDuration}`,
              description: `Fitness training with ${trainer.name} for ${duration} months`,
            },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      // success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription`,
      metadata: {
        userId,
        trainerId,
        plan,
        amount,
        startDate,
        endDate,
        duration
      },
     })
     res.status(200).json({success:true, sessionId: session.id });
      
    } catch (error) {
      next(error);
    }
  }

  // const stripeWebhookHandler = async (req, res,next) =>{
  //   try {

  //     const sig = req.headers['stripe-signature'];
  // let event;
      
  //   } catch (error) {
  //     next(error)
  //   }
  // }




  const getUserPaymentHistory=async (req,res,next)=>{
    try {
      
      const userId=req.user.id;

      const user=await User.findById(userId).select('paymentHistory subscription');
         
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      paymentHistory: user.paymentHistory,
      subscription: user.subscription
    });


    } catch (error) {
      next(error)
    }
  }

  module.exports={paymentFunction,getUserPaymentHistory,
    createPaymentOrder,confirmPayment}
