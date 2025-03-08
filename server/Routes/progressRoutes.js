const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const { saveProgress, checkWorkoutCompletion, getProgressHistory, getProgressSummary, 
    getProgressByDate, getUserProgress } = require("../Controllers/progressController");



// user
router.post("/",protect,authorize(["user"]),saveProgress);

router.get("/check",protect,authorize(["user"]),checkWorkoutCompletion);

router.get("/history",protect,authorize(["user"]),getProgressHistory);
// router.get("/",protect,authorize(["user"]),getUserProgress);

router.get('/summary', protect,authorize(["user"]),getProgressSummary);

router.get('/date/:date', protect,authorize(["user"]),getProgressByDate);





// router.post("/workout-complete",protect,authorize(["user"]),markWorkoutCompleted);
// router.post("/nutrition-followed",protect,authorize(["user"]),markNutritionFollowed);

// router.put("/add-note/:userid",protect,authorize(["trainer"]),addProgressNote);
// router.get("/trainer/users",protect,authorize(["trainer"]),getAllUserProgress)

// // // admin
// router.get("/all",protect,authorize(["admin"]),getAllProgress);





module.exports=router;
