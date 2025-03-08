import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveProgress } from '../../services/userServices';
import { setWorkoutInProgress, updateWorkoutStatus } from '../../redux/features/userSlice';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export const WorkoutStartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get workout from location state
  const workout = location.state?.workout;
  const userId = useSelector(state => state.user.user._id);
  
  // State for tracking workout progress
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastExerciseData, setLastExerciseData] = useState(null); // Store the last exercise data specifically
  const [weight, setWeight] = useState("");
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    arms: "",
    legs: ""
  });
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const startRestTimer = () => {
    // Set a default rest time (60 seconds) or use a configured rest time
    const restTime = workout.restTimeBetweenExercises || 60;
    setRestTimeLeft(restTime);
  };
  
  // Timer for tracking workout duration
  useEffect(() => {
    // Set start time if not already set
    if (!workoutStartTime) {
      setWorkoutStartTime(new Date());
    }
    
    // Update elapsed time every second
    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - workoutStartTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [workoutStartTime]);
  
  // Rest timer
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      const timer = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isResting, restTimeLeft]);
  
  // Workout tracking at page load
  useEffect(() => {
    // Mark workout as in-progress when the page loads
    if (workout?._id) {
      dispatch(setWorkoutInProgress({ workoutId: workout._id }));
    }
    
    // Redirect if no workout is found
    if (!workout) {
      navigate('/user/dashboard');
    }
  }, [workout, dispatch, navigate]);
  
  // Redirect if workout completes
  useEffect(() => {
    if (isWorkoutComplete) {
      // Save progress to API
      const progressData = {
        userId,
        workoutId: workout.id,
        completed: true,
        duration: elapsedTime,
        exercises: completedExercises,
        date: new Date().toISOString().split('T')[0]
      };
      
      console.log("Progress Data inside useEffect to be send to backend: ", progressData);
      
      saveProgress(progressData)
        .then(response => {
          // Update workout status to completed
          dispatch(updateWorkoutStatus({ 
            workoutId: workout.id, 
            status: 'completed' 
          }));
          
          // Navigate to completion page after short delay
          setTimeout(() => {
            navigate('/user/progress', { 
              state: { 
                workout, 
                duration: elapsedTime,
                exercises: completedExercises
              } 
            });
          }, 1500);
        })
        .catch(error => {
          console.error('Error saving progress:', error);
        });
    }
  }, [isWorkoutComplete, dispatch, navigate, workout, elapsedTime, completedExercises, userId]);
  
  // If workout or exercises aren't available yet, show loading
  if (!workout || !workout.exercises) {
    return <LoadingSpinner/>;
  }
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  const handleCompleteExercise = (exerciseData) => {
    console.log("handle complete exercise:");
    
    // Create completed exercise object with basic data
    const completedExercise = {
      ...exerciseData,
      completedAt: new Date().toISOString(),
    };
    
    // For non-final exercises, just add to completed exercises
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCompletedExercises([...completedExercises, completedExercise]);
      console.log("Added to completed exercises:", completedExercise);
      
      // Start rest timer and move to next exercise
      setIsResting(true);
      startRestTimer();
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // For the final exercise, store its data temporarily but don't add to completed exercises yet
      // We'll add it after the modal data is collected
      setLastExerciseData(exerciseData);
      setShowModal(true);
    }
  };

  const handleSaveExerciseData = () => {
    // Ensure we have the last exercise data
    if (!lastExerciseData) return;
    
    // Create a completed exercise object with measurements for the final exercise
    const finalExercise = {
      ...lastExerciseData,
      completedAt: new Date().toISOString(),
      weight: Number(weight) || 0,
      measurements: {
        chest: Number(measurements.chest) || 0,
        waist: Number(measurements.waist) || 0,
        arms: Number(measurements.arms) || 0,
        legs: Number(measurements.legs) || 0,
      },
    };
    
    // Update the completed exercises array with all exercises including the final one
    const updatedCompletedExercises = [...completedExercises, finalExercise];
    setCompletedExercises(updatedCompletedExercises);
    
    console.log("All completed exercises:", updatedCompletedExercises);
    
    // Close modal and mark workout as complete to trigger the API call
    setShowModal(false);
    
    // Reset input fields
    setWeight("");
    setMeasurements({
      chest: "",
      waist: "",
      arms: "",
      legs: ""
    });
    
    // Set workout as complete - this will trigger the useEffect to make the API call
    setIsWorkoutComplete(true);
    console.log("Setting workout complete to trigger API call");
  };
  
  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };
  
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  const handleExitWorkout = () => {
    // Confirm before exiting
    if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
      // Save partial progress
      const progressData = {
        userId,
        workoutId: workout._id,
        completed: false,
        duration: elapsedTime,
        exercises: completedExercises,
        date: new Date().toISOString().split('T')[0]
      };

      console.log("Inside handleExitWorkout progress data sending ", progressData);
      
      saveProgress(progressData)
        .then(() => {
          navigate('/user/dashboard');
        })
        .catch(error => {
          console.error('Error saving progress:', error);
        });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Workout header */}
      <div className="bg-primary text-primary-content rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          <div className="text-lg">Time: {formatTime(elapsedTime)}</div>
        </div>
        <div className="mt-2">
          <progress 
            className="progress progress-accent w-full" 
            value={currentExerciseIndex} 
            max={workout.exercises.length}
          ></progress>
          <div className="text-sm mt-1">
            Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
          </div>
        </div>
      </div>
      
      {/* Rest timer overlay */}
      {isResting && (
        <div className="bg-base-300 rounded-lg p-6 mb-6 text-center">
          <h2 className="text-xl font-bold mb-4">Rest Time</h2>
          <div className="text-3xl font-bold mb-4">{restTimeLeft}s</div>
          <p className="mb-4">Next up: {currentExercise.name}</p>
          <button 
            className="btn btn-primary" 
            onClick={handleSkipRest}
          >
            Skip Rest
          </button>
        </div>
      )}
      
      {/* Current exercise */}
      {!isResting && currentExercise && (
        <div className="bg-base-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">{currentExercise.name}</h2>
          <p className="mb-4">{currentExercise.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-base-300 p-3 rounded-lg">
              <div className="text-sm opacity-70">Sets</div>
              <div className="text-lg font-bold">{currentExercise.sets || '3'}</div>
            </div>
            <div className="bg-base-300 p-3 rounded-lg">
              <div className="text-sm opacity-70">Reps</div>
              <div className="text-lg font-bold">{currentExercise.reps || '12'}</div>
            </div>
          </div>
          
          {/* Exercise image or video if available */}
          {currentExercise.imageUrl && (
            <div className="mb-4">
              <img 
                src={currentExercise.imageUrl} 
                alt={currentExercise.name} 
                className="rounded-lg w-full h-48 object-cover"
              />
            </div>
          )}
          
          <button 
            className="btn btn-accent w-full mt-4" 
            onClick={() => handleCompleteExercise(currentExercise)}
          >
            Complete Exercise
          </button>
        </div>
      )}
      
      {/* Exit button */}
      <button 
        className="btn btn-outline w-full" 
        onClick={handleExitWorkout}
      >
        Save & Exit
      </button>

      {/* Modal for Additional Data */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Log Workout Details</h3>
      
            {/* Weight Input */}
            <label className="block mb-2">Weight (kg):</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              className="input input-bordered w-full mb-4" 
            />
      
            {/* Measurements */}
            <label className="block mb-2">Body Measurements (cm):</label>
      
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Chest:</label>
                <input 
                  type="number" 
                  value={measurements.chest} 
                  onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })} 
                  className="input input-bordered w-full" 
                />
              </div>
              <div>
                <label>Waist:</label>
                <input 
                  type="number" 
                  value={measurements.waist} 
                  onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })} 
                  className="input input-bordered w-full" 
                />
              </div>
              <div>
                <label>Arms:</label>
                <input 
                  type="number" 
                  value={measurements.arms} 
                  onChange={(e) => setMeasurements({ ...measurements, arms: e.target.value })} 
                  className="input input-bordered w-full" 
                />
              </div>
              <div>
                <label>Legs:</label>
                <input 
                  type="number" 
                  value={measurements.legs} 
                  onChange={(e) => setMeasurements({ ...measurements, legs: e.target.value })} 
                  className="input input-bordered w-full" 
                />
              </div>
            </div>
      
            {/* Workout Completed Checkbox */}
            <label className="flex items-center mt-4">
              <input 
                type="checkbox" 
                checked={workoutCompleted} 
                onChange={() => setWorkoutCompleted(!workoutCompleted)} 
                className="checkbox checkbox-primary" 
              />
              <span className="ml-2">Workout Completed</span>
            </label>
      
            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button className="btn btn-error" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveExerciseData}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};