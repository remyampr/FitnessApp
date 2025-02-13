const Workout=require("../Models/Workout");
const uploadToCloudinary=require("../Utilities/imageUpload")

const createWorkout=async (req,res,next)=>{
    try {
        const { name, description, workoutType, difficulty, duration, exercises} = req.body;
        const image = req.file ? req.file.path : ""; 

        if (!name || !workoutType || !difficulty || !duration || !exercises ) {
            return res.status(400).json({ error: "All required fields must be provided." });
          }

          const existingWorkout = await Workout.findOne({ name });
        if (existingWorkout) {
            return res.status(400).json({ error: "This workout already exists!" });
        }

          const parsedExercises = JSON.parse(exercises);  // Convert exercises from string to array
          
        const cloudinaryRes=await uploadToCloudinary(image);
        console.log("image in cloudinary : ",cloudinaryRes);

        const newWorkout=new Workout({
            name, description, workoutType, difficulty, duration, exercises:parsedExercises,image:cloudinaryRes ,createdBy:req.user._id, createdByType:req.user.role
        })
        let savedWorkout=await newWorkout.save();
        if(savedWorkout){
            return res.status(200).json({msg:"New Workout added",savedWorkout})
        }

        
    } catch (error) {
        next(error)
    }


}

// All workout
const getAllWorkouts = async (req, res,next) => {
    try {
      const workouts = await Workout.find();
      res.status(200).json(workouts);
    } catch (error) {
      next(error)
    }
  };
  
  // get workout by ID
  const getWorkoutById = async (req, res,next) => {
    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout) {
        return res.status(404).json({ error: "Workout not found." });
      }
      res.status(200).json(workout);
    } catch (error) {
        next(error)
    }
  };


  //  updating a workout plan (Admin only)
const updateWorkoutPlan = async (req, res,next) => {
    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout) {
        return res.status(404).json({ error: "Workout not found." });
      }
  
      if (workout.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "You do not have permission to update this workout." });
      }
  
      workout.title = req.body.title || workout.title;
      workout.description = req.body.description || workout.description;
      workout.duration = req.body.duration || workout.duration;
      workout.difficulty = req.body.difficulty || workout.difficulty;
      workout.image = req.file ? req.file.path : workout.image;
  
      await workout.save();
      res.status(200).json(workout);
    } catch (error) {
        next(error)
    }
  };
  
  // deleting a workout plan (Admin only)
  const deleteWorkoutPlan = async (req, res,next) => {
    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout) {
        return res.status(404).json({ error: "Workout not found." });
      }
  
    //   if (workout.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    //     return res.status(403).json({ error: "You do not have permission to delete this workout." });
    //   }
  
      await workout.deleteOne()
      res.status(200).json({ message: "Workout plan deleted successfully." });
    } catch (error) {
        next(error)
    }
  };
  
  //  getting workouts created by a specific trainer
  const getWorkoutsForTrainer = async (req, res,next) => {
    try {
      const workouts = await Workout.find({ createdBy: req.user.id });
      res.status(200).json(workouts);
    } catch (error) {
        next(error)
    }
  };
  



module.exports={createWorkout,getAllWorkouts, getWorkoutById,updateWorkoutPlan,deleteWorkoutPlan,getWorkoutsForTrainer,}