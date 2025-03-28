const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const {
  createNutrition,
  getAllNutritionPlans,
  getNutritionPlanById,
  updateNutritionPlan,
  getNutritionPlansForTrainer,
  getUserNutritionPlans,
  deactivateNutritionPlan
} = require("../Controllers/nutritionController");

router.post("/create",protect,authorize(["trainer", "admin"]),upload.single("image"),createNutrition);

router.get("/all", protect, authorize(["admin"]), getAllNutritionPlans);
router.get("nutrition/:id", protect, authorize(["trainer,admin"]), getNutritionPlanById);

// router.put("/:id", protect, authorize(["admin"]), updateNutritionPlan);
router.put("/:id", protect, authorize(["admin"]), upload.single("image"),updateNutritionPlan);

router.patch("/:id", protect, authorize(["admin"]), deactivateNutritionPlan);
router.get("/trainer", protect, authorize(["trainer"]), getNutritionPlansForTrainer);


// Get today's & tomorrow's nutrition plans (User Dashboard)
router.get("/user", protect, authorize(["user"]), getUserNutritionPlans);


module.exports = router;
