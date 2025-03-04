const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const { paymentFunction, getUserPaymentHistory, stripeWebhookHandler}=require("../Controllers/paymentController");


// router.post("/order",protect,authorize(["user"]),createPaymentOrder);
// router.post("/confirm",protect,authorize(["user"]),confirmPayment);

// router.post("/makepayment",protect,authorize(["user"]),paymentFunction);
// Handle successful payment webhook
// router.post("/webhook", express.raw({type: 'application/json'}), stripeWebhookHandler);

// router.get("/payment-success")

// get payment history for user
// router.get('/history',protect,authorize(["user"]),getUserPaymentHistory);



module.exports=router;