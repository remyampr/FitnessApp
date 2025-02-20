const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const {
    updateUserProgress,markWorkoutCompleted,markNutritionFollowed,getUserProgress,
    addProgressNote,getAllUserProgress,
    getAllProgress
  }=require("../Controllers/progressController");


// user
router.post("/update-progress",protect,authorize(["user"]),updateUserProgress);
router.post("/workout-complete",protect,authorize(["user"]),markWorkoutCompleted);
router.post("/nutrition-followed",protect,authorize(["user"]),markNutritionFollowed);
router.get("/user",protect,authorize(["user"]),getUserProgress);
// // trainer
router.put("/add-note/:userid",protect,authorize(["trainer"]),addProgressNote);
router.get("/trainer/users",protect,authorize(["trainer"]),getAllUserProgress)

// // admin
router.get("/all",protect,authorize(["admin"]),getAllProgress);





module.exports=router;
