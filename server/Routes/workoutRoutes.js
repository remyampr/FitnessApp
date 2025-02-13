const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const upload=require("../middleware/multer");
const {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    getWorkoutsForTrainer,
  } = require("../Controllers/workoutController");



router.post("/create",protect,authorize(["admin","trainer"]),upload.single("image"),createWorkout);
router.get("/all", protect, authorize(["admin"]), getAllWorkouts);
router.put("/:id", protect, authorize(["admin"]), updateWorkoutPlan);
router.delete("/:id", protect, authorize(["admin"]), deleteWorkoutPlan);
router.get("/", protect, authorize(["trainer"]), getWorkoutsForTrainer);



module.exports=router;