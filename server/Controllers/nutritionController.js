const Activity = require("../Models/Activity");
const { logActivity } = require("../Utilities/activityServices");
const Nutrition = require("../Models/Nutrition");
const User=require("../Models/User")
const uploadToCloudinary = require("../Utilities/imageUpload");

const createNutrition = async (req, res, next) => {
  try {
    const { title,fitnessGoal,schedule,waterIntake,} = req.body;
    const image = req.file ? req.file.path :  'Uploads/nutrition.jpg'; 


    if (!title || !fitnessGoal || !schedule || !waterIntake) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    let parsedSchedule;

    if (typeof schedule === 'string') {
      parsedSchedule = JSON.parse(schedule);  // Parse the string into an object
    } else {
      parsedSchedule = schedule;
    }

    // console.log("Parsed Schedule:", parsedSchedule);
   

    const cloudinaryRes = await uploadToCloudinary(image);
    // console.log("image in cloudinary : ", cloudinaryRes);

    const newNutrition = new Nutrition({
      title,
      fitnessGoal,
      schedule:parsedSchedule,

      waterIntake,
       image: cloudinaryRes,
      createdBy: req.user._id,
      createdByType: req.user.role,
    });

    let savedNutrition=await newNutrition.save();

    await logActivity("NEW_NUTRITION_PLAN",newNutrition._id,"nutritionPlan", { createdBy: newNutrition.createdBy, goal: newNutrition.goal },{
      _id: req.user._id,
      role: req.user.role,
      email: req.user.email,
      name: req.user.name
    })

 

    if(savedNutrition){
        return res.status(200).json({message:"New Nutrition data added",savedNutrition})
    }

  } catch (error) {
    next(error);
  }
};


const getAllNutritionPlans = async (req, res,next) => {

try {
    const nutritionPlans=await Nutrition.find();

    if (nutritionPlans.length === 0) {
        return res.status(404).json({ message: "No nutrition plans found" });
      }
      return res.status(200).json({nutritionPlans, count: nutritionPlans.length,});



} catch (error) {
    next(error)
}

}

const getNutritionPlanById = async (req, res,next) => {

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

const updateNutritionPlan = async (req, res,next) => {
try {
    
    const { id } = req.params;
    const updatedData = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "You do not have permission to update this nutrition plan" });
      }

      if (updatedData.schedule && typeof updatedData.schedule === 'string') {
        updatedData.schedule = JSON.parse(updatedData.schedule); 
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

const deactivateNutritionPlan  = async (req, res,next) => {
    try {

        const { id } = req.params;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "You do not have permission to delete this nutrition plan" });
          }

          const nutritionPlan = await Nutrition.findById(id);
          if (!nutritionPlan) {
            return res.status(404).json({ message: "Nutrition plan not found" });
          }

          nutritionPlan.status = 'inactive';
          await nutritionPlan.save();
      
          return res.status(200).json({ message: "Nutrition plan deactivated successfully" });
        
    } catch (error) {
        next(error)
    }


}

const getNutritionPlansForTrainer = async (req, res,next) => {
try {

    const trainerId = req.user._id; 
    const nutritionPlans = await Nutrition.find({ createdBy: trainerId });

    // if (nutritionPlans.length === 0) {
    //     return res.status(404).json({ message: "No nutrition plans found for this trainer" });
    //   }
    return res.status(200).json({
      data: nutritionPlans,
      count: nutritionPlans.length || 0
    });


} catch (error) {
    next(error)
}

}

// Get today's & tomorrow's nutrition (User Dashboard)
// based on goals
const getUserNutritionPlans = async (req, res,next) => {
  try {
    const userId = req.user.id;
     const user = await User.findById(userId);
     if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const getDayName = (date) => {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    const todayName = getDayName(today);
    const tomorrowName = getDayName(tomorrow);

 // Find nutrition created by user's trainer OR admin and match fitness goal
    const nutritionPlans=await Nutrition.find({
      $or:[
        { createdBy: user.trainerId }, 
        { createdByType: "admin" },
      ],
      fitnessGoal: user.fitnessGoal,
      "schedule.day": { $in: [todayName,tomorrowName] },
     })



    res.status(200).json({ success: true, data: nutritionPlans });
  } catch (error) {
    next(error)
  }
};






module.exports = {
  createNutrition,
  getAllNutritionPlans,
  getNutritionPlanById,
  updateNutritionPlan,
  deactivateNutritionPlan,
  getNutritionPlansForTrainer,
  getUserNutritionPlans
};
