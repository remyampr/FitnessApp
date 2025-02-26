const Workout = require("../Models/Workout");
const User = require("../Models/User");
const uploadToCloudinary = require("../Utilities/imageUpload");
const Activity = require("../Models/Activity");

const createWorkout = async (req, res, next) => {
  try {
    const { name, description, fitnessGoal, difficulty, duration, schedule } =
      req.body;
    const image = req.file ? req.file.path :  'Uploads/workout.jpg';

    if (!name || !fitnessGoal || !difficulty || !duration || !schedule) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

     const parsedSchedule = JSON.parse(schedule);
    if (!Array.isArray(parsedSchedule)) {
      return res.status(400).json({ error: "Invalid schedule format." });
    }

    const existingWorkout = await Workout.findOne({ name, createdBy: req.user._id });
    if (existingWorkout) {
      return res.status(400).json({ error: "This workout already exists!" });
    }

    const cloudinaryRes = await uploadToCloudinary(image);
    if (!cloudinaryRes) {
      return res.status(500).json({ error: "Failed to upload image to Cloudinary." });
    }
    console.log("image in cloudinary : ", cloudinaryRes);

    const newWorkout = new Workout({
      name,
      description,
      fitnessGoal,
      difficulty,
      duration,
      schedule: parsedSchedule,
      image: cloudinaryRes,
      createdBy: req.user._id,
      createdByType: req.user.role,
    });
    let savedWorkout = await newWorkout.save();

    await logActivity("NEW_WORKOUT", newWorkout._id, "workout", { createdBy: newWorkout.createdBy });


    if (savedWorkout) {
      return res.status(200).json({ msg: "New Workout added", savedWorkout });
    }

  } catch (error) {
    next(error);
  }
};

// All workout
const getAllWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find();
    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

// get workout by ID
const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found." });
    }
    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
};

//  updating a workout plan (Admin only)
const updateWorkoutPlan = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found." });
    }

    if (
      workout.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "You do not have permission to update this workout." });
    }

    workout.title = req.body.title || workout.title;
    workout.description = req.body.description || workout.description;
    workout.duration = req.body.duration || workout.duration;
    workout.difficulty = req.body.difficulty || workout.difficulty;
    workout.image = req.file ? req.file.path : workout.image;

    await workout.save();
    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
};

// deleting a workout plan (Admin only)
const deleteWorkoutPlan = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found." });
    }

    //   if (workout.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    //     return res.status(403).json({ error: "You do not have permission to delete this workout." });
    //   }

    await workout.deleteOne();
    res.status(200).json({ message: "Workout plan deleted successfully." });
  } catch (error) {
    next(error);
  }
};

//  getting workouts created by a specific trainer
const getWorkoutsForTrainer = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ createdBy: req.user.id });
    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

// Get today's & tomorrow's workouts (User Dashboard)
// based on goals
const getUserWorkouts = async (req, res, next) => {
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

     // Find workouts created by user's trainer OR admin and match fitness goal
     const workouts=await Workout.find({
      $or:[
        { createdBy: user.trainerId }, 
        { createdByType: "admin" },
      ],
      fitnessGoal: user.fitnessGoal,
      "schedule.day": { $in: [todayName,tomorrowName] },
     })

     res.status(200).json({ success: true, data: workouts });

  } catch (error) {
    next(error);
  }
};





module.exports = {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutsForTrainer,
  getUserWorkouts,
};
