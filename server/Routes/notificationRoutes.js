const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const { markNotificationsAsRead, getUserNotifications } = require("../Controllers/notificationController");


// uer routes


// Trainer routes


router.get('/notification', protect, getUserNotifications);
router.post('/notifications/read', protect, markNotificationsAsRead);




module.exports=router;




































