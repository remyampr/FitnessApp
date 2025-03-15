import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setError,
  setLoading,
  setNutritionPlans,
} from "../../redux/features/adminSlice";

import { createNutritionPlan, getAllNutritionPlans, updateNutritionPlan } from "../../services/adminServices";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { AlertError } from "../../components/shared/AlertError";

export const NutritionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nutritionPlans, loading, error } = useSelector((state) => state.admin);

  const [selectedGoal, setSelectedGoal] = useState("");
  const fitnessGoals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Gain",
    "Maintenance",
    "Endurance Improvement",
  ];

  const filteredPlans = selectedGoal
    ? nutritionPlans.filter((plan) => plan.fitnessGoal === selectedGoal)
    : nutritionPlans;

  const [nutritionForm, setNutritionForm] = useState({
    title: "", // Changed from 'name' to 'title' to match backend
    fitnessGoal: "Weight Loss",
    schedule: [
      {
        day: "Monday",
        meals: [
          {
            type: "breakfast",
            foods: [
              {
                name: "",
                quantity: 0,
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
              },
            ],
          },
        ],
      },
    ],
    waterIntake: 0,
    image: null,
    status: "active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);

  useEffect(() => {
    fetchNutritionPlans();
    dispatch(setError(null));
  }, []);

  const fetchNutritionPlans = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllNutritionPlans();

      // console.log("Nutrition resp ", response.data);

      if (response && response.data && response.data.nutritionPlans) {
        dispatch(setNutritionPlans(response.data.nutritionPlans));
      } else if (response && response.data) {
        dispatch(setNutritionPlans(response.data));
      }
      
      // console.log("nutritionplans in redux ", nutritionPlans);

      dispatch(setLoading(false));
    } catch (err) {
      console.error("Error fetching nutrition plans:", err);
      dispatch(setError("Failed to fetch nutrition plans"));
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNutritionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNutritionForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      // console.log("nutritionForm before creating FormData:", nutritionForm);
      const formData = new FormData();
      
      // Add all form fields to FormData with correct field names
      formData.append("title", nutritionForm.title); // Changed from 'name' to 'title'
      formData.append("fitnessGoal", nutritionForm.fitnessGoal);
      formData.append("waterIntake", nutritionForm.waterIntake);
      
      // Convert schedule object to JSON string for FormData
      const scheduleString = JSON.stringify(nutritionForm.schedule);
      formData.append("schedule", scheduleString);
      
      // Add image only if it exists
      if (nutritionForm.image) {
        formData.append("image", nutritionForm.image);
      }
      
      // Add status
      formData.append("status", nutritionForm.status);

      if (isEditing && currentPlanId) {
        const updateResponse = await updateNutritionPlan(
          currentPlanId,
          formData
        );
        // console.log("Update response : ", updateResponse.data);
      } else {
        const createResponse = await createNutritionPlan(formData);
        // console.log("Create response : ", createResponse);
      }

      await fetchNutritionPlans();
      resetForm();
      dispatch(setLoading(false));
    } catch (err) {
      console.error("Error saving nutrition plan:", err);
      dispatch(setError("Failed to save nutrition plan"));
      dispatch(setLoading(false));
    }
  };

  const editPlan = (plan) => {
    setIsEditing(true);
    setCurrentPlanId(plan._id);
  
    const schedule =
      plan.schedule && plan.schedule.length > 0
        ? plan.schedule?.map((day) => ({
            day: day.day,
            meals: day.meals?.map((meal) => ({
              type: meal.type,
              foods:
                meal.foods && meal.foods.length > 0
                  ? meal.foods
                  : [{ name: "", quantity: 0, calories: 0, protein: 0, carbs: 0, fats: 0 }],
            })),
          }))
        : [
            {
              day: "Monday",
              meals: [
                {
                  type: "breakfast",
                  foods: [
                    { name: "", quantity: 0, calories: 0, protein: 0, carbs: 0, fats: 0 },
                  ],
                },
              ],
            },
          ];
  
    setNutritionForm({
      title: plan.title || "", // Changed from 'name' to 'title'
      fitnessGoal: plan.fitnessGoal || "Weight Loss",
      schedule: schedule,
      waterIntake: plan.waterIntake || 0,
      image: plan.image || "", 
      createdBy: plan.createdBy || "",
      createdByType: plan.createdByType || "trainer",
      status: plan.status || "active",
    });
  };

  const resetForm = () => {
    setNutritionForm({
      title: "", // Changed from 'name' to 'title'
      fitnessGoal: "Weight Loss", 
      schedule: [
        {
          day: "Monday", 
          meals: [
            {
              type: "breakfast", 
              foods: [
                {
                  name: "",
                  quantity: 0,
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fats: 0,
                },
              ],
            },
          ],
        },
      ],
      waterIntake: 0,
      image: null,
      status: "active",
    });
    setIsEditing(false);
    setCurrentPlanId(null);
    dispatch(setError(null));
  };
  
  const addFoodToMeal = (mealIndex, dayIndex) => {
    const newSchedule = [...nutritionForm.schedule];
    newSchedule[dayIndex].meals[mealIndex].foods.push({
      name: "",
      quantity: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
    setNutritionForm((prev) => ({ ...prev, schedule: newSchedule }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 p-2">

      <div >
        <h1 className="text-3xl font-bold mb-6">Nutrition Plan Management</h1>

        {error && (
          <AlertError error={error} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nutrition Plan Creation/Edit Form */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? "Edit Nutrition Plan" : "Create New Nutrition Plan"}
            </h2>
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
             <div className="form-control m">
                <label className="label mr-2 ">Plan Title</label>
                <input
                  type="text"
                  name="title"
                  value={nutritionForm.title}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label mr-2">Goal</label>
                <select
                  name="fitnessGoal"
                  value={nutritionForm.fitnessGoal}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Weight Gain">Weight Gain</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Endurance Improvement">Endurance Improvement</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label mr-2">Water Intake (ml)</label>
                <input
                  type="number"
                  name="waterIntake"
                  value={nutritionForm.waterIntake}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label mr-2">Plan Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered"
                  accept="image/*"
                />
                {isEditing && (
                  <p className="text-xs mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
             </div>

              {/* Schedule Section (Days and Meals) */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                {nutritionForm.schedule?.map((day, dayIndex) => (
                  <div key={dayIndex} className="mt-4 p-4 bg-base-200 rounded">
                    <div className="form-control">
                      <label className="label">Day</label>
                      <select
                        value={day.day}
                        onChange={(e) => {
                          const newSchedule = [...nutritionForm.schedule];
                          newSchedule[dayIndex].day = e.target.value;
                          setNutritionForm((prev) => ({
                            ...prev,
                            schedule: newSchedule,
                          }));
                        }}
                        className="select select-bordered"
                      >
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    </div>
                    
                    {day.meals?.map((meal, mealIndex) => (
                      <div key={mealIndex} className="mt-4 p-4 bg-base-50 rounded">
                        <div className="form-control">
                          <label className="label">Meal Type</label>
                          <select
                            value={meal.type}
                            onChange={(e) => {
                              const newSchedule = [...nutritionForm.schedule];
                              newSchedule[dayIndex].meals[mealIndex].type = e.target.value;
                              setNutritionForm((prev) => ({
                                ...prev,
                                schedule: newSchedule,
                              }));
                            }}
                            className="select select-bordered"
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                          </select>
                        </div>
                        
                        <h4 className="font-medium mt-2">Foods</h4>
                        {meal.foods?.map((food, foodIndex) => (
                          <div key={foodIndex} className="mt-2 p-2 bg-base-100 rounded">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="form-control">
                                <label className="label text-xs">Food Name</label>
                                <input
                                  type="text"
                                  placeholder="Food Name"
                                  value={food.name}
                                  onChange={(e) => {
                                    const newSchedule = [...nutritionForm.schedule];
                                    newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].name = e.target.value;
                                    setNutritionForm((prev) => ({
                                      ...prev,
                                      schedule: newSchedule,
                                    }));
                                  }}
                                  className="input input-bordered input-sm"
                                  required
                                />
                              </div>
                              
                              <div className="form-control">
                                <label className="label text-xs">Quantity</label>
                                <input
                                  type="number"
                                  placeholder="Quantity"
                                  value={food.quantity}
                                  onChange={(e) => {
                                    const newSchedule = [...nutritionForm.schedule];
                                    newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].quantity = Number(e.target.value);
                                    setNutritionForm((prev) => ({
                                      ...prev,
                                      schedule: newSchedule,
                                    }));
                                  }}
                                  className="input input-bordered input-sm"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div className="form-control">
                                <label className="label text-xs">Calories</label>
                                <input
                                  type="number"
                                  placeholder="Calories"
                                  value={food.calories}
                                  onChange={(e) => {
                                    const newSchedule = [...nutritionForm.schedule];
                                    newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].calories = Number(e.target.value);
                                    setNutritionForm((prev) => ({
                                      ...prev,
                                      schedule: newSchedule,
                                    }));
                                  }}
                                  className="input input-bordered input-sm"
                                  required
                                />
                              </div>
                              
                              <div className="form-control">
                                <label className="label text-xs">Protein (g)</label>
                                <input
                                  type="number"
                                  placeholder="Protein"
                                  value={food.protein}
                                  onChange={(e) => {
                                    const newSchedule = [...nutritionForm.schedule];
                                    newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].protein = Number(e.target.value);
                                    setNutritionForm((prev) => ({
                                      ...prev,
                                      schedule: newSchedule,
                                    }));
                                  }}
                                  className="input input-bordered input-sm"
                                  required
                                />
                              </div>
                              
                              <div className="form-control">
                                <label className="label text-xs">Carbs (g)</label>
                                <input
                                  type="number"
                                  placeholder="Carbs"
                                  value={food.carbs}
                                  onChange={(e) => {
                                    const newSchedule = [...nutritionForm.schedule];
                                    newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].carbs = Number(e.target.value);
                                    setNutritionForm((prev) => ({
                                      ...prev,
                                      schedule: newSchedule,
                                    }));
                                  }}
                                  className="input input-bordered input-sm"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="form-control mt-2">
                              <label className="label text-xs">Fats (g)</label>
                              <input
                                type="number"
                                placeholder="Fats"
                                value={food.fats}
                                onChange={(e) => {
                                  const newSchedule = [...nutritionForm.schedule];
                                  newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].fats = Number(e.target.value);
                                  setNutritionForm((prev) => ({
                                    ...prev,
                                    schedule: newSchedule,
                                  }));
                                }}
                                className="input input-bordered input-sm"
                                required
                              />
                            </div>
                            
                            {foodIndex > 0 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-error mt-2"
                                onClick={() => {
                                  const newSchedule = [...nutritionForm.schedule];
                                  newSchedule[dayIndex].meals[mealIndex].foods.splice(foodIndex, 1);
                                  setNutritionForm((prev) => ({
                                    ...prev,
                                    schedule: newSchedule,
                                  }));
                                }}
                              >
                                Remove Food
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary mt-2"
                          onClick={() => addFoodToMeal(mealIndex, dayIndex)}
                        >
                          Add Food Item
                        </button>
                      </div>
                    ))}
                    
                    {/* Add Meal Button */}
                    <button
                      type="button"
                      className="btn btn-sm btn-primary mt-2"
                      onClick={() => {
                        const newSchedule = [...nutritionForm.schedule];
                        newSchedule[dayIndex].meals.push({
                          type: "lunch",
                          foods: [
                            { 
                              name: "", 
                              quantity: 0, 
                              calories: 0, 
                              protein: 0, 
                              carbs: 0, 
                              fats: 0 
                            }
                          ]
                        });
                        setNutritionForm((prev) => ({
                          ...prev,
                          schedule: newSchedule,
                        }));
                      }}
                    >
                      Add Meal
                    </button>
                  </div>
                ))}
           
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-6 w-full"
                disabled={loading}
              >
                {isEditing ? "Update Plan" : "Create Plan"}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-outline mt-2 w-full"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Nutrition Plan List */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">All Nutrition Plans</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
              {/* Filter Dropdown */}
              <div className="mb-4 ">
                <label className="mr-2 font-medium">Filter by Goal:</label>
                <select
                  className="p-2 border rounded bg-base-100"
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
        
              {/* Nutrition Plans List */}
              <div>
                {filteredPlans && filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <div key={plan._id} className="mb-4 p-4 bg-base-50 rounded">
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p>
                        <strong>Goal:</strong> {plan.fitnessGoal}
                      </p>
                      <p>
                        <strong>Water Intake:</strong> {plan.waterIntake} ml
                      </p>
                      <button
                        className="btn btn-warning btn-sm mt-2"
                        onClick={() => editPlan(plan)}
                      >
                        Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No nutrition plans found.</p>
                )}
              </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};