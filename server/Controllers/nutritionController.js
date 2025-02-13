const Nutrition = require("../Models/Nutrition");
const uploadToCloudinary = require("../Utilities/imageUpload");

const createNutrition = async (req, res, next) => {
  try {
    const { title,nutritionType,meals,waterIntake,} = req.body;
    const image = req.file ? req.file.path : ""; 


    if (!title || !nutritionType || !meals || !waterIntake) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    const existingNutrition = await Nutrition.findOne({ title });
    if (existingNutrition) {
      return res.status(400).json({ error: "This  already exists!" });
    }

    const parsedMeals = JSON.parse(meals); 

    const cloudinaryRes = await uploadToCloudinary(image);
    console.log("image in cloudinary : ", cloudinaryRes);

    const newNutrition = new Nutrition({
      title,
      nutritionType,
      meals:parsedMeals,
      waterIntake,
       image: cloudinaryRes,
      createdBy: req.user._id,
      createdByType: req.user.role,
    });

    let savedNutrition=await newNutrition.save();
    if(savedNutrition){
        return res.status(200).json({msg:"New Nutrition data added",savedNutrition})
    }

  } catch (error) {
    next(error);
  }
};


const getAllNutritionPlans = async (req, res) => {

try {
    const nutritionPlans=await Nutrition.find();

    if (nutritionPlans.length === 0) {
        return res.status(404).json({ message: "No nutrition plans found" });
      }
      return res.status(200).json(nutritionPlans);



} catch (error) {
    next(error)
}

}

const getNutritionPlanById = async (req, res) => {

try {
    const { id } = req.params;

    const nutritionPlan = await Nutrition.findById(id);

    if (!nutritionPlan) {
        return res.status(404).json({ message: "Nutrition plan not found" });
      }
      return res.status(200).json(nutritionPlan);
    
    
} catch (error) {
    next(error)
}

}

const updateNutritionPlan = async (req, res) => {
try {
    
    const { id } = req.params;
    const updatedData = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "You do not have permission to update this nutrition plan" });
      }

      const updatedPlan = await Nutrition.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedPlan) {
        return res.status(404).json({ message: "Nutrition plan not found" });
      }

      return res.status(200).json(updatedPlan);


} catch (error) {
    next(error)
}

}

const deleteNutritionPlan = async (req, res) => {
    try {

        const { id } = req.params;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "You do not have permission to delete this nutrition plan" });
          }

          const deletedPlan = await Nutrition.findByIdAndDelete(id);

          if (!deletedPlan) {
            return res.status(404).json({ message: "Nutrition plan not found" });
          }

          return res.status(200).json({ message: "Nutrition plan deleted successfully" });
        
    } catch (error) {
        next(error)
    }


}

const getNutritionPlansForTrainer = async (req, res) => {
try {

    const trainerId = req.user._id; 
    const nutritionPlans = await Nutrition.find({ createdBy: trainerId });

    if (nutritionPlans.length === 0) {
        return res.status(404).json({ message: "No nutrition plans found for this trainer" });
      }

      return res.status(200).json(nutritionPlans);


} catch (error) {
    next(error)
}

}





module.exports = {
  createNutrition,
  getAllNutritionPlans,
  getNutritionPlanById,
  updateNutritionPlan,
  deleteNutritionPlan,getNutritionPlansForTrainer
};
