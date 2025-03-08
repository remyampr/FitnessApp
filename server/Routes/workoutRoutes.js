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
    getUserWorkouts,
    deactivateWorkoutPlan
  } = require("../Controllers/workoutController");


// Get today's & tomorrow's workouts (User Dashboard)
router.get("/user", protect, authorize(["user"]), getUserWorkouts);

router.post("/create",protect,authorize(["admin","trainer"]),upload.single("image"),createWorkout);

router.get("/all", protect, authorize(["admin"]), getAllWorkouts);

router.get("workout/:id", protect, authorize(["admin","trainer"]), getWorkoutById);

// router.put("/:id", protect, authorize(["admin"]), updateWorkoutPlan);
router.put("/:id", protect, authorize(["admin"]), upload.single("image"), updateWorkoutPlan);

router.patch("/:id", protect, authorize(["admin"]), deactivateWorkoutPlan);

router.get("/trainer", protect, authorize(["trainer"]), getWorkoutsForTrainer);




module.exports=router;