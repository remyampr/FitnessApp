const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const {createPaymentOrder,confirmPayment}=require("../Controllers/paymentController");


router.post("/order",protect,authorize(["user"]),createPaymentOrder);
router.post("/confirm",protect,authorize(["user"]),confirmPayment);


module.exports=router;