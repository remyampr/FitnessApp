const express=require("express");
const router=express.Router();
const upload=require("../middleware/multer");
const {protect,authorize}=require("../middleware/authMiddleware");

const {
    registerUser,
    verifyEmail,
    loginUser,
    logout,
    updateUserProfile,
    getUserProfile,
    getCertifiedTrainers,
    assignTrainer,
    forgotPassword,
    resetPassword,
    myTrainer
  } = require("../Controllers/userController");

router.post("/register",registerUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login",loginUser);
router.post("/logout",logout);
router.get("/trainers/certified",protect, authorize(["user"]),getCertifiedTrainers);
router.put("/trainers/assign",protect, authorize(["user"]),assignTrainer);
router.put("/profile/update", protect, authorize(["user"]),upload.single("image"),updateUserProfile);
router.get("/profile", protect, authorize(["user"]), getUserProfile);
router.get("/my-trainer",protect,authorize(["user"]),myTrainer)


/* ***************************************************

router.get('/my-progress', auth, userController.getMyProgress);

*/ 

module.exports=router;



