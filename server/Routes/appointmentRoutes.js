const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAppointmentsForTrainer,
    getAppointmentsForUser,
  } = require("../Controllers/appointmentController");

// user  book an appointment with trainer
  router.post("/create",protect,authorize(["user"]),createAppointment);
// get all appointments admin only
  router.get("/all", protect, authorize(["admin"]), getAllAppointments);
  // get a single appointment by ID (accessible by admin and trainer)
router.get("/:id", protect, authorize(["admin", "trainer"]), getAppointmentById);
//  update an appointment (admin only)
router.put("/:id", protect, authorize(["admin"]), updateAppointment);
// delete  appointment (admin only)
router.delete("/:id", protect, authorize(["admin"]), deleteAppointment);
// getting all appointments of a trainer in trainers dashboard
router.get("/appointments", protect, authorize("trainer"), getAppointmentsForTrainer);
// get appointment in user dashboard  (accessible by user)
router.get("/user", protect, authorize(["user"]), getAppointmentsForUser);


module.exports=router;