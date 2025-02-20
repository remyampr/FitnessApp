const Workout = require("../Models/Workout");
const User = require("../Models/User");
const Nutrition = require("../Models/Nutrition");
const Progress=require("../Models/Progress");
const uploadToCloudinary = require("../Utilities/imageUpload");

// user
const updateUserProgress=async(req,res,next)=>{
    try {
        const { weight, measurements} = req.body;

        const progress = await Progress.create({
            userId: req.user.id,
            weight,
            measurements: {
              chest: measurements.chest,
              waist: measurements.waist,
              arms: measurements.arms,
              legs: measurements.legs
            },
            date: new Date()
          });
      
        
    res.status(200).json({status: 'success', data: progress });
        
    } catch (error) {
        next(error);
    }
}
const markWorkoutCompleted=async(req,res,next)=>{
    try {
        const { workoutId} = req.body;
        

        const workout = await Workout.findById(workoutId);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found." });
        }


        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const weight = user.weight; 

        let progress = await Progress.findOne({
            userId: req.user.id,
            date: {
              $gte: new Date().setHours(0, 0, 0, 0),
              $lt: new Date().setHours(23, 59, 59, 999)
            }
          });

      

          if (!progress) {
            progress = await Progress.create({
                userId: req.user.id,
                date: new Date(),
                weight,
                workoutCompleted: [workoutId]
              });
            } else {
            
              progress.workoutCompleted.push(workoutId);
              await progress.save();
            }
      
          res.status(200).json({status: 'success',data: progress});
        
    } catch (error) {
        next(error);
    }
}
const markNutritionFollowed=async(req,res,next)=>{
    try {
        const { nutritionId} = req.body;

        const nutrition = await Nutrition.findById(nutritionId);
    if (!nutrition) {
        return res.status(404).json({ error: "Nutrition plan not found." });

    }


    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    const weight = user.weight; 

    let progress = await Progress.findOne({
        userId: req.user.id,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      });
  
      if (!progress) {
        progress = await Progress.create({
          userId: req.user.id,
          date: new Date(),
          weight, 
          nutritionFollowed: [nutritionId]
        });
      } else {
        progress.nutritionFollowed.push(nutritionId);
        await progress.save();
      }
          res.status(200).json({status: 'success',data: progress});
    
    } catch (error) {
        next(error);
    }
}
const getUserProgress=async(req,res,next)=>{
    try {

        const progress = await Progress.find({ userId: req.user.id })
        .populate('workoutCompleted')
        .populate('nutritionFollowed')
        .sort('-date');
  
      res.status(200).json({ status: 'success',data: progress });
        
    } catch (error) {
        next(error);
    }
}



// trainer
const addProgressNote = async (req, res, next) => {
    try {
      const { note } = req.body;
      const { userid } = req.params;
  
      let progress = await Progress.findOne({
        userId: userid,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      });
  
      if (!progress) {
        progress = await Progress.create({
          userId: userid,
          date: new Date(),
          trainerNotes: note
        });
      } else {
        progress.trainerNotes = note;
        await progress.save();
      }
  
      res.status(200).json({status: 'success', data: progress});
    } catch (error) {
      next(error);
    }
  };
  
  const getAllUserProgress = async (req, res, next) => {
    try {
      //  req.user.assignedUsers contains array of user IDs assigned to trainer
      const progress = await Progress.find({
        userId: { $in: req.user.clients }
      })
        .populate('userId', 'name email')
        .populate('workoutCompleted')
        .populate('nutritionFollowed')
        .sort('-date');
  
      res.status(200).json({status: 'success',data: progress});
    } catch (error) {
      next(error);
    }
  };
  
//   admin
 const getAllProgress = async (req, res, next) => {
    try {
      const progress = await Progress.find()
        .populate('userId', 'name email')
        .populate('workoutCompleted')
        .populate('nutritionFollowed')
        .sort('-date');
  
      res.status(200).json({
        status: 'success',
        data: progress
      });
    } catch (error) {
      next(error);
    }
  };

  module.exports={
    updateUserProgress,markWorkoutCompleted,markNutritionFollowed,getUserProgress,
    addProgressNote,getAllUserProgress,
    getAllProgress
  }

