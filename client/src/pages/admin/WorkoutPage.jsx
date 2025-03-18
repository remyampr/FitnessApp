import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setError,
  setLoading,
  setWorkouts,
} from "../../redux/features/adminSlice";
import {
  createWorkout,
  getAllWorkouts,
  updateWorkoutPlan,
} from "../../services/adminServices";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { AlertError } from "../../components/shared/AlertError";

export const WorkoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { workouts, loading, error } = useSelector((state) => state.admin);
  const [selectedGoal, setSelectedGoal] = useState("");
  const fitnessGoals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Gain",
    "Maintenance",
    "Endurance Improvement",
  ];

  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    description: "",
    fitnessGoal: "Weight Loss",
    difficulty: "Easy",
    duration: 1,
    image: null,
    schedule: [
      {
        day: "Monday",
        exercises: [{ name: "", sets:"", reps: "", restTime: "", notes: "" }],
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);

  const filteredWorkouts = selectedGoal
    ? workouts.filter((workout) => workout.fitnessGoal === selectedGoal)
    : workouts;

  useEffect(() => {
    fetchWorkouts();
    dispatch(setError(null));
  }, []);

  const fetchWorkouts = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllWorkouts();

      console.log("Workout resp ", response.data);

      if (response && response.data && response.data.workouts) {
        dispatch(setWorkouts(response.data.workouts));
      } else if (response && response.data) {
        dispatch(setWorkouts(response.data));
      }

      // console.log("Workout in redux ", workouts);

      dispatch(setLoading(false));
    } catch (err) {
      console.error("Error fetching workouts:", err);
      dispatch(setError("Failed to fetch workouts"));
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    console.log("image adding ...");
    
    setWorkoutForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      console.log("workoutForm before creating FormData:", workoutForm);

      const formData = new FormData();
      Object.keys(workoutForm).forEach((key) => {
        if (key === "image" && workoutForm[key]) {
          formData.append(key, workoutForm[key]);
          // console.log(`Added ${key} file to FormData`);
        } else if (key === "schedule") {
          const scheduleString = JSON.stringify(workoutForm[key]);
          formData.append(key, scheduleString);
          // console.log(`Added ${key} to FormData with length: ${scheduleString.length}`);
        } else {
          formData.append(key, workoutForm[key]);
          // console.log(`Added ${key}: ${workoutForm[key]} to FormData`);
        }
      });

      // console.log("FormData : ", formData);

      if (isEditing && currentWorkoutId) {
        // console.log("updating data ", formData);
        
        const updateResponse = await updateWorkoutPlan(
          currentWorkoutId,
          formData
        );

        // console.log("Update response : ", updateResponse.data);
      } else {
        const createResponse = await createWorkout(formData);
        console.log("Create response : ", createResponse);
      }

      await fetchWorkouts();
      resetForm();
      dispatch(setLoading(false));
    } catch (err) {
      console.error("Error saving workout:", err);
      dispatch(setError("Failed to save workout"));
      dispatch(setLoading(false));
    }
  };

  const editWorkout = (workout) => {
    setIsEditing(true);
    setCurrentWorkoutId(workout._id);

    const schedule =
      workout.schedule && workout?.schedule?.length > 0
        ? workout.schedule.map((day) => ({
            ...day,
            exercises:
              day.exercises && day.exercises.length > 0
                ? day.exercises
                : [{ name: "", sets: "", reps: "", restTime: "", notes: "" }],
          }))
        : [
            {
              day: "Monday",
              exercises: [
                { name: "", sets: "", reps: "", restTime: "", notes: "" },
              ],
            },
          ];

    setWorkoutForm({
      name: workout.name || "",
      description: workout.description || "",
      fitnessGoal: workout.fitnessGoal || "Weight Loss",
      difficulty: workout.difficulty || "Easy",
      duration: workout.duration || 1,
      image: null,
      schedule: schedule,
    });
  };

  const resetForm = () => {
    setWorkoutForm({
      name: "",
      description: "",
      fitnessGoal: "Weight Loss",
      difficulty: "Easy",
      duration: 1,
      image: null,
      schedule: [
        {
          day: "Monday",
          exercises: [{ name: "", sets: "", reps: "", restTime: "", notes: "" }],
        },
      ],
    });
    setIsEditing(false);
    setCurrentWorkoutId(null);
    dispatch(setError(null));
  };

  // Add exercise to a day
  const addExerciseToDay = (dayIndex) => {
    const newSchedule = [...workoutForm.schedule];
    newSchedule[dayIndex].exercises.push({
      name: "",
      sets: "",
      reps: "",
      restTime: "",
      notes: "",
    });
    setWorkoutForm((prev) => ({ ...prev, schedule: newSchedule }));
  };

  return (

    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200">
      <div>
        <h1 className="text-3xl font-bold mb-6">Workout Management</h1>

        {error && <AlertError error={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Workout Creation/Edit Form */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 ">
              {isEditing ? "Edit Workout" : "Create New Workout"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="form-control">
                  <label className="label mr-1.5 ">Workout Name</label>
                  <input
                    type="text"
                    name="name"
                    value={workoutForm.name}
                    onChange={handleInputChange}
                    className="input input-bordered "
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label mr-1.5">Description</label>
                  <textarea
                    name="description"
                    value={workoutForm.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered "
                  />
                </div>

                <div className="form-control">
                  <label className="label mr-1.5">Fitness Goal</label>
                  <select
                    name="fitnessGoal"
                    value={workoutForm.fitnessGoal}
                    onChange={handleInputChange}
                    className="select select-bordered "
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Weight Gain">Weight Gain</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Endurance Improvement">
                      Endurance Improvement
                    </option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label mr-1.5">Difficulty</label>
                  <select
                    name="difficulty"
                    value={workoutForm.difficulty}
                    onChange={handleInputChange}
                    className="select select-bordered "
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label mr-1.5">Duration (mins)</label>
                  <input
                    type="number"
                    name="duration"
                    value={workoutForm.duration}
                    onChange={handleInputChange}
                    className="input input-bordered "
                    min="1"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label me-1.5">Workout Image</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered "
                    accept="image/*"
                  />
                  {isEditing && (
                    <p className="text-xs mt-1 ">
                      Leave empty to keep current image
                    </p>
                  )}
                </div>
              </div>

              {/* Schedule Section */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 ">Weekly Schedule</h3>
                {workoutForm.schedule?.map((daySchedule, dayIndex) => (
                  <div key={dayIndex} className="mt-4 p-4 bg-base-200 ">
                    <h3 className="text-lg font-semibold ">
                      {daySchedule.day} Schedule
                    </h3>
                    {daySchedule.exercises?.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="mt-2 p-2 bg-base-50 "
                      >
                        <input
                          type="text"
                          placeholder="Exercise Name"
                          value={exercise.name}
                          onChange={(e) => {
                            const newSchedule = [...workoutForm.schedule];
                            newSchedule[dayIndex].exercises[
                              exerciseIndex
                            ].name = e.target.value;
                            setWorkoutForm((prev) => ({
                              ...prev,
                              schedule: newSchedule,
                            }));
                          }}
                          className="input input-bordered input-sm w-full mb-2 "
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder="Sets"
                            value={exercise.sets === undefined ? "" : exercise.sets}
                            onChange={(e) => {
                              const newSchedule = [...workoutForm.schedule];
                              newSchedule[dayIndex].exercises[
                                exerciseIndex
                              ].sets = Number(e.target.value);
                              setWorkoutForm((prev) => ({
                                ...prev,
                                schedule: newSchedule,
                              }));
                            }}
                            className="input input-bordered input-sm "
                            min="0"
                          />
                          <input
                            type="number"
                            placeholder="Reps"
                           
                            value={exercise.reps === undefined ? "" : exercise.reps}
                            onChange={(e) => {
                              const newSchedule = [...workoutForm.schedule];
                              newSchedule[dayIndex].exercises[
                                exerciseIndex
                              ].reps = Number(e.target.value);
                              setWorkoutForm((prev) => ({
                                ...prev,
                                schedule: newSchedule,
                              }));
                            }}
                            className="input input-bordered input-sm "
                            min="0"
                          />
                          <input
                            type="number"
                            placeholder="Rest Time (sec)"
                           
                            value={exercise.restTime === undefined ? "" : exercise.restTime}
                            onChange={(e) => {
                              const newSchedule = [...workoutForm.schedule];
                              newSchedule[dayIndex].exercises[
                                exerciseIndex
                              ].restTime = Number(e.target.value);
                              setWorkoutForm((prev) => ({
                                ...prev,
                                schedule: newSchedule,
                              }));
                            }}
                            className="input input-bordered input-sm "
                            min="0"
                          />
                        </div>
                        <textarea
                          placeholder="Exercise Notes"
                          value={exercise.notes || ""}
                          onChange={(e) => {
                            const newSchedule = [...workoutForm.schedule];
                            newSchedule[dayIndex].exercises[
                              exerciseIndex
                            ].notes = e.target.value;
                            setWorkoutForm((prev) => ({
                              ...prev,
                              schedule: newSchedule,
                            }));
                          }}
                          className="textarea textarea-bordered textarea-sm w-full mt-2 "
                        />
                      </div>
                    ))}
                    
                    <button
                          type="button"
                          className="btn btn-sm btn-secondary mt-2"
                          onClick={() => addExerciseToDay(dayIndex)}
                        >
                         Add Exercise
                        </button>
                        </div>
                ))}
              </div>
              <div className="form-control mt-6">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                              >
                                {loading ? (
                                  <span className="loading loading-spinner loading-sm"></span>
                                ) : isEditing ? (
                                  "Update Workout"
                                ) : (
                                  "Create Workout"
                                )}
                              </button>
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={resetForm}
                                  className="btn btn-ghost mt-2"
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
              
                        {/* Workout List */}
                        <div className="card bg-base-100 shadow-xl p-6">
                          <h2 className="text-2xl font-semibold mb-4">Existing Workouts</h2>
                          {loading ? (
                            <LoadingSpinner/>
                          ) : (
                            <div>
                                   <div className="mb-4">
                      <label className="mr-2 font-medium">Filter by Goal:</label>
                      <select
                        className="p-2 border rounded"
                        value={selectedGoal}
                        onChange={(e) => setSelectedGoal(e.target.value)}
                      >
                        <option value="">All</option>
                        {fitnessGoals.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredWorkouts?.length > 0 ? (
                        filteredWorkouts.map((workout) => (
                          <div key={workout._id} className="bg-base-100 p-4 rounded shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                {/* Truncated Name with Tooltip */}
                                <h3 className="font-medium text-lg mb-1">
                                  <div className="relative group">
                                    <span className="truncate" title={workout.name}>
                                      {workout?.name?.length > 10
                                        ? workout.name.slice(0, 6) + "..." + workout.name.slice(-4)
                                        : workout.name}
                                    </span>
                                    <span className="absolute bottom-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-100 text-white text-xs  rounded-md">
                                      {workout.name}
                                    </span>
                                  </div>
                                </h3>
                                {/* Goal */}
                                <p className="text-sm text-gray-600">{workout.fitnessGoal}</p>
                                {/* Difficulty */}
                                <p className="text-sm">Difficulty: {workout.difficulty}</p>
                              </div>
                              {/* Edit Button */}
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => editWorkout(workout)}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-4">No workouts found</div>
                      )}
                    </div>
                          </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              };
              