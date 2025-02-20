const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const checkCertification = require('../middleware/checkCertification');
const upload=require("../middleware/multer");
const {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    getWorkoutsForTrainer,
    getUserWorkouts
  } = require("../Controllers/workoutController");


// Get today's & tomorrow's workouts (User Dashboard)
router.get("/user", protect, authorize(["user"]), getUserWorkouts);

router.post("/create",protect,authorize(["admin","trainer"]),upload.single("image"),createWorkout);
router.get("/all", protect, authorize(["admin"]), getAllWorkouts);
router.get("/:id", protect, authorize(["admin","trainer"]), getWorkoutById);
router.put("/:id", protect, authorize(["admin"]), updateWorkoutPlan);
router.delete("/:id", protect, authorize(["admin"]), deleteWorkoutPlan);
router.get("/", protect, authorize(["trainer"]), getWorkoutsForTrainer);




module.exports=router;