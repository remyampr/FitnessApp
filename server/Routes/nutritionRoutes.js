const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const upload=require("../middleware/multer");
const {createNutrition,  getAllNutritionPlans,getNutritionPlanById, updateNutritionPlan,deleteNutritionPlan,getNutritionPlansForTrainer}=require("../Controllers/nutritionController")

router.post("/create",protect,authorize(["trainer","admin"]),upload.single("image"),createNutrition);
router.get("/all",protect,authorize(["admin"]),  getAllNutritionPlans);
router.get("/:id",protect,authorize(["trainer,admin"]),  getNutritionPlanById);
router.put("/:id",protect,authorize(["admin"]),updateNutritionPlan);
router.delete("/:id",protect,authorize(["admin"]),deleteNutritionPlan);
router.get("/",protect, authorize(["trainer"]), getNutritionPlansForTrainer);



module.exports=router;