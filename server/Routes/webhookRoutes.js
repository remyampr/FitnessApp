const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const User = require("../Models/User");
const Trainer = require("../Models/Trainer");
const Payment = require("../Models/Payment");

router.post(
  "/",
  express.raw({ type: "application/json" }), // Raw body for Stripe
  async (req, res) => {
    let event;
    try {
      const sig = req.headers["stripe-signature"];
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, trainerId, plan, amount, startDate, endDate, duration } =
        session.metadata;

      try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const trainer = await Trainer.findById(trainerId);
        if (!trainer) return res.status(404).json({ error: "Trainer not found" });

        // Save payment record
        const payment = new Payment({
          userId,
          trainerId,
          amount,
          plan: `${plan}_${duration}`,
          status: "Completed",
          transactionId: session.id,
        });

        await payment.save();

        // Update User Subscription
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

        console.log(
          `Payment successful: ${userId} subscribed to ${plan} for ${duration} months.`
        );
        return res.status(200).json({ message: "Subscription activated successfully" });
      } catch (error) {
        console.error("Error updating payment details:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
      return res.status(200).end(); // Always return 200 for Stripe
    }
  }
);

module.exports = router;