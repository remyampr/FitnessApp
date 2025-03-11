const Workout = require("../Models/Workout");
const User = require("../Models/User");
const Nutrition = require("../Models/Nutrition");
const Progress = require("../Models/Progress");
const uploadToCloudinary = require("../Utilities/imageUpload");
const mongoose = require("mongoose");
const Trainer = require("../Models/Trainer");

// user

const saveProgress = async (req, res, next) => {
  try {
    const {
      userId,
      workoutId,
      completed,
      exercises,
      date,
      duration,
      nutritionFollowed,
      nutritionId,
      nutritionCompleted,
      nutritionDetails,
      waterIntake,
    } = req.body;

    console.log("req.body : ", req.body);

    console.log("nutritionDetails:", nutritionDetails);

    const user = await User.findById(userId);

    const userIdToUse = userId || req.user.id;

    const today = date ? new Date(date) : new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let progress = await Progress.findOne({
      userId: userIdToUse,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const measurements = {};

    if (exercises && exercises.length > 0 && exercises[0].measurements) {
      const exerciseMeasurements = exercises[0].measurements;
      if (exerciseMeasurements.chest)
        measurements.chest = Number(exerciseMeasurements.chest);
      if (exerciseMeasurements.waist)
        measurements.waist = Number(exerciseMeasurements.waist);
      if (exerciseMeasurements.arms)
        measurements.arms = Number(exerciseMeasurements.arms);
      if (exerciseMeasurements.legs)
        measurements.legs = Number(exerciseMeasurements.legs);
    }

    const weight =
      exercises && exercises.length > 0 && exercises[0].weight
        ? Number(exercises[0].weight)
        : undefined;

    if (progress) {
      if (weight) progress.weight = weight;

      if (Object.keys(measurements).length > 0) {
        progress.measurements = {
          ...progress.measurements,
          ...measurements,
        };
      }

      if (workoutId && completed) {
        const workoutObjectId = mongoose.Types.ObjectId.isValid(workoutId)
          ? workoutId
          : new mongoose.Types.ObjectId(workoutId);

        if (
          !progress.workoutCompleted.includes(workoutObjectId) &&
          !progress.workoutCompleted.some(
            (id) => id.toString() === workoutObjectId.toString()
          )
        ) {
          progress.workoutCompleted.push(workoutObjectId);
        }
      }

      if (!progress.workoutDetails) progress.workoutDetails = [];

      // Add workout details if not already present
      const workoutExists = progress.workoutDetails.some(
        (detail) =>
          detail.workoutId && detail.workoutId.toString() === workoutId
      );

      if (!workoutExists && workoutId) {
        progress.workoutDetails.push({
          workoutId,
          completed,
          duration,
          exercises,
          completedAt: new Date(),
        });
      }

      // Handle nutrition data if provided
      if (nutritionId) {
        const nutritionEntry = {
          nutritionId,
          completed: nutritionCompleted || false,
          details: nutritionDetails || {},
          waterIntake: waterIntake || 0,
          completedAt: new Date(),
        };

        // Check if this nutrition plan is already recorded
        const existingNutritionIndex = progress.nutritionDetails.findIndex(
          (detail) => detail.nutritionId.toString() === nutritionId
        );
        if (existingNutritionIndex >= 0) {
          // Update existing nutrition record
          progress.nutritionDetails[existingNutritionIndex] = nutritionEntry;
        } else {
          // Add new nutrition record
          progress.nutritionDetails.push(nutritionEntry);
        }
      }

      await progress.save();
    } else {
      const workoutCompleted = workoutId && completed ? [workoutId] : [];

      const workoutDetails = workoutId
        ? [
            {
              workoutId,
              completed,
              duration,
              exercises,
              completedAt: new Date(),
            },
          ]
        : [];

      const nutritionEntries = nutritionId
        ? [
            {
              nutritionId,
              completed: nutritionCompleted || false,
              details: nutritionDetails || {},
              waterIntake: waterIntake || 0,
              completedAt: new Date(),
            },
          ]
        : [];

      progress = new Progress({
        userId: userIdToUse,
        date: today,
        weight: req.body.weight || undefined,
        measurements: Object.keys(measurements).length > 0 ? measurements : {},
        workoutCompleted,
        workoutDetails,
        nutritionDetails:nutritionEntries,
        trainerNotes: "",
      });

      // progress = new Progress({
      //   userId: userIdToUse,
      //   date: today,
      //   weight: weight || undefined,
      //   measurements: Object.keys(measurements).length > 0 ? measurements : {},
      //   workoutCompleted,
      //   nutritionFollowed: [],
      //   trainerNotes: "",
      //   workoutDetails: workoutId ? [{
      //     workoutId,
      //     completed,
      //     duration,
      //     exercises,
      //     completedAt: new Date()
      //   }] : []
      // });

      await progress.save();
    }
    if (weight) {
      await User.findByIdAndUpdate(userIdToUse, {
        currentWeight: weight,
        lastProgressUpdate: today,
      });
    }

    console.log("Progress saved : ", progress);

    res.status(201).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

const checkWorkoutCompletion = async (req, res, next) => {
  try {
    const { date, workoutId } = req.query;
    const userId = req.user.id;

    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const progress = await Progress.findOne({
      userId,
      date: {
        $gte: queryDate,
        $lt: nextDay,
      },
    });
    console.log("Progress inside checkWorkoutCompletion :  ", progress);

    if (!progress) {
      return res.json({
        success: true,
        completed: false,
        completedWorkouts: [],
      });
    }

    const completedWorkouts = progress.workoutCompleted.map((id) =>
      id.toString()
    );

    if (workoutId) {
      const isCompleted = completedWorkouts.includes(workoutId.toString());
      return res.json({
        success: true,
        completed: isCompleted,
        completedWorkouts,
      });
    }

    res.json({
      success: true,
      completed: completedWorkouts.length > 0,
      completedWorkouts,
    });
  } catch (error) {
    next(error);
  }
};
const getProgressHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("inside getProgress history userId ", userId);

    const progress = await Progress.find({ userId })
      .populate({
        path: "workoutCompleted",
        select: "name duration difficulty image", // specify fields you want
      })
      .populate({
        path: "nutritionFollowed",
        select: "name type calories image", // specify fields you want
      });

    console.log(
      "inside get-progress-history controller progress  : ",
      progress
    );

    console.log(`Found ${progress.length} progress entries for user ${userId}`);

    // const total = await Progress.countDocuments(query);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
const getProgressSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's first and latest progress entries
    const [first, latest] = await Promise.all([
      Progress.findOne({ userId }).sort({ date: 1 }),
      Progress.findOne({ userId }).sort({ date: -1 }),
    ]);

    if (!first || !latest) {
      return res.json({
        success: true,
        data: {
          startingWeight: 0,
          currentWeight: 0,
          weightChange: 0,
          totalWorkoutsCompleted: 0,
          measurementsChange: {
            chest: 0,
            waist: 0,
            arms: 0,
            legs: 0,
          },
          nutritionAdherence: 0,
          
        },
      });
    }

    const totalWorkoutsCompleted = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $project: { workoutCount: { $size: "$workoutCompleted" } } },
      { $group: { _id: null, total: { $sum: "$workoutCount" } } },
    ]);

    const weightChange = latest.weight - first.weight;

    const measurementsChange = {
      chest: (latest.measurements.chest || 0) - (first.measurements.chest || 0),
      waist: (latest.measurements.waist || 0) - (first.measurements.waist || 0),
      arms: (latest.measurements.arms || 0) - (first.measurements.arms || 0),
      legs: (latest.measurements.legs || 0) - (first.measurements.legs || 0),
    };

     // Calculate nutrition adherence
     const nutritionData = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: { path: "$nutritionDetails", preserveNullAndEmptyArrays: true } },
      { 
        $group: { 
          _id: null, 
          totalPlanned: { $sum: { $cond: [{ $ifNull: ["$nutritionDetails", false] }, 1, 0] } },
          totalCompleted: { $sum: { $cond: [{ $eq: ["$nutritionDetails.completed", true] }, 1, 0] } }
        } 
      }
    ]);

    const nutritionAdherence = nutritionData.length > 0 && nutritionData[0].totalPlanned > 0 
    ? (nutritionData[0].totalCompleted / nutritionData[0].totalPlanned) * 100 
    : 0;
    

    res.json({
      success: true,
      data: {
        startingWeight: first.weight,
        currentWeight: latest.weight,
        weightChange,
        totalWorkoutsCompleted: totalWorkoutsCompleted[0]?.total || 0,
        startDate: first.date,
        latestDate: latest.date,
        measurementsChange,
        currentMeasurements: latest.measurements,
        nutritionAdherence: parseFloat(nutritionAdherence.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};
const getProgressByDate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const progress = await Progress.findOne({
      userId,
      date: {
        $gte: queryDate,
        $lt: nextDay,
      },
    })
      .populate("workoutCompleted", "name duration difficulty image")
      .populate("nutritionFollowed", "name type calories image");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress data found for this date",
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProgress = async (req, res, next) => {
  try {
    const { weight, measurements } = req.body;

    const progress = await Progress.create({
      userId: req.user.id,
      weight,
      measurements: {
        chest: measurements.chest,
        waist: measurements.waist,
        arms: measurements.arms,
        legs: measurements.legs,
      },
      date: new Date(),
    });

    res.status(200).json({ status: "success", data: progress });
  } catch (error) {
    next(error);
  }
};
const markWorkoutCompleted = async (req, res, next) => {
  try {
    const { workoutId } = req.body;

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
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        date: new Date(),
        weight,
        workoutCompleted: [workoutId],
      });
    } else {
      progress.workoutCompleted.push(workoutId);
      await progress.save();
    }

    res.status(200).json({ status: "success", data: progress });
  } catch (error) {
    next(error);
  }
};
const markNutritionFollowed = async (req, res, next) => {
  try {
    const { nutritionId } = req.body;

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
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        date: new Date(),
        weight,
        nutritionFollowed: [nutritionId],
      });
    } else {
      progress.nutritionFollowed.push(nutritionId);
      await progress.save();
    }
    res.status(200).json({ status: "success", data: progress });
  } catch (error) {
    next(error);
  }
};
const getUserProgress = async (req, res, next) => {
  try {
    console.log("user progress : ");

    const progress = await Progress.find({ userId: req.user.id })
      .populate("workoutCompleted")
      .populate("nutritionFollowed")
      .sort("-date");

    res.status(200).json({ status: "success", data: progress });
  } catch (error) {
    next(error);
  }
};

// trainer
const addProgressNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const { userid } = req.params;

    let progress = await Progress.findOne({
      userId: userid,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    if (!progress) {
      progress = await Progress.create({
        userId: userid,
        date: new Date(),
        trainerNotes: note,
      });
    } else {
      progress.trainerNotes = note;
      await progress.save();
    }

    res.status(200).json({ status: "success", data: progress });
  } catch (error) {
    next(error);
  }
};

const getAllUserProgress = async (req, res, next) => {
  try {

    const trainer = await Trainer.findById(req.user.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found"
      });
    }

       // No clients
       if (!trainer.clients || trainer.clients.length === 0) {
        return res.status(200).json({
          success: true,
          progress: [],
          count: 0
        });
      }

    
   
    const progress = await Progress.find({
      userId: { $in: req.user.clients },
    })
      .populate("userId", "name email")
      .populate("workoutCompleted")
      .populate("nutritionFollowed")
      .sort("-date");

    res.status(200).json({ status: "success", data: progress,count:progress.length });
  } catch (error) {
    next(error);
  }
};


const getClientProgress = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.user.id);
    
    if (!trainer) {
      return res.status(404).json({ 
        success: false, 
        message: "Trainer not found" 
      });
    }
    
    // Check if this client belongs to the trainer
    if (!trainer.clients.includes(req.params.clientId)) {
      return res.status(403).json({
        success: false,
        message: "This client is not associated with your account"
      });
    }
    
    const progress = await Progress.findOne({ userId: req.params.clientId })
      .sort({ date: -1 }) // Get the most recent progress entry
      .limit(1);
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress data found for this client"
      });
    }
    
    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
};

//   admin
const getAllProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find()
      .populate("userId", "name email")
      .populate("workoutCompleted")
      .populate("nutritionFollowed")
      .sort("-date");

    res.status(200).json({
      status: "success",
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveProgress,
  checkWorkoutCompletion,
  getProgressHistory,
  getProgressSummary,
  getProgressByDate,

  updateUserProgress,
  markWorkoutCompleted,
  markNutritionFollowed,
  getUserProgress,

  addProgressNote,
  getAllUserProgress,
  getClientProgress,
  
  getAllProgress,
};
