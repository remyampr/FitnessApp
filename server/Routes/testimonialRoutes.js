const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const { postTestimonial, getAllTestimonials, getUserTestimonial } = require("../Controllers/testimonialController");


router.post("/user",protect,authorize(["user"]),postTestimonial);
router.get("/user",protect,authorize(["user"]),getUserTestimonial);
// router.get("/admin",protect,authorize(["admin"]),getAllTestimonials);

router.get("/", getAllTestimonials); 



module.exports=router;