const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  registerUser,
  updateUserProfile,
  getUserProfile,
  assignTrainer,
  getApprovedTrainers,
  getMyTrainer,
  reviewMyTrainer,
  deleteMyTrainerReview,
} = require("../Controllers/userController");

const {
  verifyEmail,
  forgotPassword,
  resetPassword,
  login,
  logout,
} = require("../Controllers/commonController");

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.post("/logout", logout);
router.get("/trainers/approved",protect,authorize(["user"]),getApprovedTrainers);
router.put("/trainers/assign", protect, authorize(["user"]), assignTrainer);
router.put("/profile/update",protect,authorize(["user"]),upload.single("image"),updateUserProfile);
router.get("/profile", protect, authorize(["user"]), getUserProfile);
router.get("/my-trainer", protect, authorize(["user"]), getMyTrainer);
router.post("/my-trainer/review",protect,authorize(["user"]),reviewMyTrainer);

router.delete("/my-trainer/review",protect, authorize(["user"]),deleteMyTrainerReview);




module.exports = router;
