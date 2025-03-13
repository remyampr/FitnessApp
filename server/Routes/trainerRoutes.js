const express = require("express");
const router = express.Router();
const upload=require("../middleware/multer");
const {protect,authorize}=require("../middleware/authMiddleware");

const {
  registerTrainer,
    getTrainerRevenue,
  updateTrainerProfile,
  getTrainerProfile,
  getTrainerClients,
  getClientById,
  getMyReviews,

} = require("../Controllers/trainerController");

const { verifyEmail,forgotPassword, resetPassword,
login,logout
 } = require("../Controllers/commonController")

router.post("/register",upload.single("image"), registerTrainer);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

router.get("/revenue",protect, authorize(["trainer"]), getTrainerRevenue)

 router.put("/profile/update", protect, authorize(["trainer"]),upload.single("image"),updateTrainerProfile);
 
 router.get("/profile", protect, authorize(["trainer"]), getTrainerProfile);

 router.get("/clients", protect, authorize(["trainer"]), getTrainerClients);
 router.get("/clients/:clientId", protect, authorize(["trainer"]), getClientById);

router.get('/my-reviews',  protect, authorize(["trainer"]),getMyReviews);




/* 
client chat ? chat application? qr code for payment?
or mobile app?
client progress
*/


module.exports = router;
