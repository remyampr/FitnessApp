const express=require("express");
const router=express.Router();
const upload=require("../middleware/multer");
const {protect,authorize}=require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    logout,
    updateUserProfile
  } = require("../Controllers/userController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logout);
router.put("/profile/update", protect, authorize(["user"]),upload.single("image"),updateUserProfile);


module.exports=router;