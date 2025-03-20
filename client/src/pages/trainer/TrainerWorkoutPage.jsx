import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewWorkout } from '../../services/trainerServices';
import { addWorkout} from '../../redux/features/trainerSlice';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export const TrainerWorkoutPage = () => {
  const dispatch = useDispatch();
  const { workouts, loading } = useSelector((state) => state.trainer);
    const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fitnessGoal: 'Weight Loss',
    difficulty: 'Easy',
    duration: '',
    schedule: [{ day: 'Monday', exercises: [{ name: '', sets: 0, reps: 0, restTime: 0, notes: "" }] }],
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

// console.log("WorkoutPage Workouts in redux : ",workouts);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    
    // Create preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleDayChange = (index, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index].day = value;
    setFormData({ ...formData, schedule: updatedSchedule });
    // console.log(formData);
    
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].exercises[exerciseIndex][field] = value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addExercise = (dayIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].exercises.push({ name: '', sets: 0, reps: 0, restTime: 0, notes: "" });
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].exercises.splice(exerciseIndex, 1);
    setFormData({ ...formData, schedule: updatedSchedule });
  };


  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      fitnessGoal: 'Weight Loss',
      difficulty: 'Easy',
      duration: '',
      schedule: [{ day: 'Monday', exercises: [{ name: '', sets: 0, reps: 0, restTime: 0,notes: "" }] }],
      image: null
    });
    setPreviewImage(null);
    setIsFormOpen(false);
    setSelectedWorkout(null);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('fitnessGoal', formData.fitnessGoal);
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('schedule', JSON.stringify(formData.schedule));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response= await addNewWorkout(formDataToSend);

// console.log("addNewWorkout Respose : ",response);

dispatch(addWorkout(response.data.savedWorkout));
  
      resetForm();
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const viewWorkoutDetails = (workout) => {
    setSelectedWorkout(workout);
  };

  const closeDetails = () => {
    setSelectedWorkout(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "Easy":
        return 'bg-green-100 text-green-800';
      case "Medium":
        return 'bg-yellow-100 text-yellow-800';
      case  "Hard":
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Workout Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancel' : 'Create New Workout'}
        </button>
      </div>

      {/* Create Workout Form */}
      {isFormOpen && (
        <div className="bg-base-200 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Workout</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Workout Name</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Duration (mins)</span>
                </label>
                <input 
                  type="number" 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleInputChange} 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fitness Goal</span>
                </label>
                <select 
                  name="fitnessGoal" 
                  value={formData.fitnessGoal} 
                  onChange={handleInputChange} 
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Endurance Improvement">Endurance</option>
                  <option value="Weight Gain">"Weight Gain"</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
          
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Difficulty Level</span>
                </label>
                <select 
                  name="difficulty" 
                  value={formData.difficulty} 
                  onChange={handleInputChange} 
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="textarea textarea-bordered w-full h-24"
                  required
                ></textarea>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Workout Image</span>
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="file-input file-input-bordered w-full" 
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="h-40 object-cover rounded-md" 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Workout Schedule</h3>
              {formData.schedule.map((day, dayIndex) => (
                <div key={dayIndex} className="bg-base-100 p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="form-control">
                      <select 
                        value={day.day} 
                        onChange={(e) => handleDayChange(dayIndex, e.target.value)} 
                        className="select select-bordered"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>
                  
                  </div>

                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 border-b border-base-300 mb-2">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-sm">Exercise</span>
                        </label>
                        <input 
                          type="text" 
                          value={exercise.name} 
                          onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'name', e.target.value)} 
                          className="input input-bordered input-sm" 
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-sm">Sets</span>
                        </label>
                        <input 
                          type="number" 
                          value={exercise.sets} 
                          onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', e.target.value)} 
                          className="input input-bordered input-sm" 
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-sm">Reps</span>
                        </label>
                        <input 
                          type="number" 
                          value={exercise.reps} 
                          onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', e.target.value)} 
                          className="input input-bordered input-sm" 
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-sm">Rest Time</span>
                        </label>
                        <input 
                          type="number" 
                          value={exercise.restTime} 
                          onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'restTime', e.target.value)} 
                          className="input input-bordered input-sm" 
                          required
                        />
                      </div>
                      <div className="form-control md:col-span-4">
      <label className="label">
        <span className="label-text text-sm">Notes</span>
      </label>
      <textarea
        value={exercise.notes || ''}
        onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
        className="textarea textarea-bordered textarea-sm"
        rows="2"
        placeholder="Add any additional notes here..."
      ></textarea>
    </div>
                      <div className="flex items-end mb-2">
                        <button 
                          type="button" 
                          className="btn btn-sm btn-error" 
                          onClick={() => removeExercise(dayIndex, exerciseIndex)}
                          disabled={day.exercises.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline btn-primary mt-2" 
                    onClick={() => addExercise(dayIndex)}
                  >
                    Add Exercise
                  </button>
                </div>
              ))}

            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={resetForm}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                 {isLoading ? <span className="loading loading-spinner"></span> : ' Create Workout'}
               
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workouts List */}
      <div className="bg-base-200 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Workouts</h2>
        
        {loading ? (
       <LoadingSpinner/>
        ) : workouts && workouts?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts?.data?.map((workout) => (
              <div key={workout._id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                <figure className="h-40">
                  <img 
                    src={workout.image || '/default-workout.jpg'} 
                    alt={workout.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/workout.jpg';
                    }}
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{workout.name}</h3>
                  <p className="text-sm line-clamp-2">{workout.description}</p>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {workout.fitnessGoal}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                      {workout.duration} {workout.duration === 1 ? 'min' : 'mins'}
                    </span>
                  </div>
                  <div className="card-actions justify-end mt-2">
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => viewWorkoutDetails(workout)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">No workouts found. Create your first workout!</p>
            {!isFormOpen && (
              <button 
                className="btn btn-primary mt-4" 
                onClick={() => setIsFormOpen(true)}
              >
                Create Workout
              </button>
            )}
          </div>
        )}
      </div>

      {/* Workout Details Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedWorkout.image || '/workout.jpg'} 
                alt={selectedWorkout.name} 
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  e.target.src = '/workout.jpg';
                }}
              />
              <button 
                className="btn btn-sm btn-circle absolute right-2 top-2" 
                onClick={closeDetails}
              >✕</button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedWorkout.name}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-sm ${getDifficultyColor(selectedWorkout.difficulty)}`}>
                  {selectedWorkout.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  {selectedWorkout.fitnessGoal}
                </span>
                <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                {selectedWorkout.duration} {selectedWorkout.duration === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Description</h3>
                <p className="text-gray-700">{selectedWorkout.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Weekly Schedule</h3>
                <div className="space-y-4">
                  {selectedWorkout.schedule.map((day, index) => (
                    <div key={index} className="border border-base-300 rounded-lg p-4">
                      <h4 className="font-medium text-lg mb-2">{day.day}</h4>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-base-300">
                            <th className="text-left py-2">Exercise</th>
                            <th className="text-center py-2">Sets</th>
                            <th className="text-center py-2">Reps</th>
                            <th className="text-center py-2">Rest Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises.map((exercise, exIndex) => (
                            <tr key={exIndex} className="border-b border-base-200">
                              <td className="py-2">{exercise.name}</td>
                              <td className="text-center py-2">{exercise.sets}</td>
                              <td className="text-center py-2">{exercise.reps}</td>
                              <td className="text-center py-2">{exercise.restTime || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="btn btn-primary" 
                  onClick={closeDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

