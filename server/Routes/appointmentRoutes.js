const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const { bookAppointment, getUserAppointments, updateUserAppointment, cancelUserAppointment, getTrainerAppointments, updateTrainerAppointment, getAppointmentById, getAllAppointments, updateAppointmentByAdmin, deleteAppointmentByAdmin } = require("../Controllers/appointmentController");

// uer routes
router.post("/book",protect,authorize(["user"]),bookAppointment);
router.get("/user",protect,authorize(["user"]),getUserAppointments);
router.put("/user/:id",protect,authorize(["user"]),updateUserAppointment);
router.delete("/user/:id",protect,authorize(["user"]),cancelUserAppointment);

// Trainer routes
router.get("/trainer",protect,authorize(["trainer"]),getTrainerAppointments);
router.put("/trainer/:id",protect,authorize(["trainer"]),updateTrainerAppointment);

// Admin routes
router.get('/all', protect, authorize(["admin"]), getAllAppointments);

router.get("/:id",protect,authorize(["user","trainer","admin"]),getAppointmentById);
 router.put('/admin/:id', protect, authorize(["admin"]), updateAppointmentByAdmin);
 router.delete('/admin/:id', protect, authorize(["admin"]),deleteAppointmentByAdmin);




module.exports=router;




































