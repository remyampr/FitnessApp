const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const { bookAppointment, getUserAppointments, updateAppointmentByUser, cancelUserAppointment,
     getTrainerAppointments, updateAppointmentByTrainer, 
     getAppointmentById,
     getAllAppointments,
     forceUpdateAppointment,
     getTrainerAvilability,
     forceDeleteAppointment} = require("../Controllers/appointmentController");

// uer routes
router.get('/trainer-availability/:trainerId',protect,authorize(["user"]),getTrainerAvilability);
router.post("/book",protect,authorize(["user"]),bookAppointment);
router.get("/user",protect,authorize(["user"]),getUserAppointments);
router.put("/user/:id",protect,authorize(["user"]),updateAppointmentByUser);
router.delete("/user/:id",protect,authorize(["user"]),cancelUserAppointment);


// Trainer routes
router.get("/trainer",protect,authorize(["trainer"]),getTrainerAppointments);
router.put("/trainer/:id",protect,authorize(["trainer"]),updateAppointmentByTrainer);

// all
router.get("/:id",protect,authorize(["user","trainer","admin"]),getAppointmentById);

// Admin routes
router.get('/admin/all', protect, authorize(["admin"]), getAllAppointments);
 router.put('/override/:id', protect, authorize(["admin"]), forceUpdateAppointment);
 router.delete('/override/:id', protect, authorize(["admin"]), forceDeleteAppointment);


// router.get('/appointments/statistics', adminAppointmentController.getAppointmentStatistics);




module.exports=router;




































