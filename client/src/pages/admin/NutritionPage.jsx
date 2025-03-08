import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setError,
  setLoading,
  setNutritionPlans,
} from "../../redux/features/adminSlice";

import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { createNutritionPlan, getAllNutritionPlans, updateNutritionPlan } from "../../services/adminServices";

export const NutritionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nutritionPlans, loading, error } = useSelector((state) => state.admin);

  const [nutritionForm, setNutritionForm] = useState({
    name: "",
    fitnessGoal: "Weight Loss", // Adjusted from 'goal' to 'fitnessGoal'
    schedule: [
      {
        day: "Monday", // Default day, this can be dynamic based on user input
        meals: [
          {
            type: "breakfast", // Default meal type
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
    image:null,
   
    status: "active",
  });
  



//   const [nutritionForm, setNutritionForm] = useState({
//     name: "",
//     description: "",
//     goal: "Weight Loss",
//     difficulty: "Easy",
//     duration: 1,
//     image: null,
//     meals: [
//       {
//         mealType: "Breakfast",
//         foods: [{ name: "", quantity: 0, notes: "" }],
//       },
//     ],
//   });

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

      console.log("Nutrition resp ", response.data);

      if (response && response.data && response.data.nutritionPlans) {
        dispatch(setNutritionPlans(response.data.nutritionPlans));
      } else if (response && response.data) {
        dispatch(setNutritionPlans(response.data));
      }
      
      console.log("nutritionplans in redux ", nutritionPlans);

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
      console.log("nutritionForm before creating FormData:", nutritionForm);
      const formData = new FormData();
      Object.keys(nutritionForm).forEach((key) => {
        if (key === "image" && nutritionForm[key]) {
          formData.append(key, nutritionForm[key]);
        } else if (key ==="schedule") {
            const scheduleString = JSON.stringify(nutritionForm[key]);
            formData.append(key, scheduleString);
        } else {
          formData.append(key, nutritionForm[key]);
        }
      });

      if (isEditing && currentPlanId) {
        const updateResponse = await updateNutritionPlan(
          currentPlanId,
          formData
        );
        console.log("Update response : ", updateResponse.data);
      } else {
        const createResponse = await createNutritionPlan(formData);
        console.log("Create response : ", createResponse);
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
              day: "Monday", // Default day
              meals: [
                {
                  type: "breakfast", // Default meal type
                  foods: [
                    { name: "", quantity: 0, calories: 0, protein: 0, carbs: 0, fats: 0 },
                  ],
                },
              ],
            },
          ];
  
    setNutritionForm({
      name: plan.name || "",
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
      name: "",
      description: "",
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
      createdBy: "", 
      createdByType: "trainer",
      status: "active", // Default to active
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200">
      <AdminSidebar />

      <div className="flex-1 p-6">
  <h1 className="text-3xl font-bold mb-6">Nutrition Plan Management</h1>

  {error && (
    <div className="alert alert-error mb-4" >
      <span><button onClick={dispatch(setError(null))}>{error}</button></span>
    </div>
  )}

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Nutrition Plan Creation/Edit Form */}
    <div className="card bg-white shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? "Edit Nutrition Plan" : "Create New Nutrition Plan"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">Plan Name</label>
          <input
            type="text"
            name="name"
            value={nutritionForm.name}
            onChange={handleInputChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">Description</label>
          <textarea
            name="description"
            value={nutritionForm.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">Goal</label>
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
          </select>
        </div>

      

        <div className="form-control">
          <label className="label">Plan Image</label>
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

        {/* Schedule Section (Days and Meals) */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Schedule</h3>
          {nutritionForm.schedule?.map((day, dayIndex) => (
            <div key={dayIndex} className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-semibold">{day.day}</h3>
              {day.meals?.map((meal, mealIndex) => (
                <div key={mealIndex} className="mt-4 p-4 bg-gray-50 rounded">
                  <h3 className="text-lg font-semibold">{meal.type}</h3>
                  {meal.foods?.map((food, foodIndex) => (
                    <div key={foodIndex} className="mt-2 p-2 bg-gray-100 rounded">
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
                        className="input input-bordered input-sm w-full mb-2"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={food.quantity}
                        onChange={(e) => {
                          const newSchedule = [...nutritionForm.schedule];
                          newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].quantity = e.target.value;
                          setNutritionForm((prev) => ({
                            ...prev,
                            schedule: newSchedule,
                          }));
                        }}
                        className="input input-bordered input-sm w-full mb-2"
                      />
                      <textarea
                        placeholder="Notes"
                        value={food.notes}
                        onChange={(e) => {
                          const newSchedule = [...nutritionForm.schedule];
                          newSchedule[dayIndex].meals[mealIndex].foods[foodIndex].notes = e.target.value;
                          setNutritionForm((prev) => ({
                            ...prev,
                            schedule: newSchedule,
                          }));
                        }}
                        className="textarea textarea-bordered w-full"
                      />
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
      </form>
    </div>

    {/* Nutrition Plan List */}
    <div className="card bg-white shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-4">All Nutrition Plans</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {nutritionPlans?.map((plan) => (
            <div key={plan._id} className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">{plan.name}</h3>
              <p>{plan.description}</p>
              <button
                className="btn btn-warning btn-sm mt-2"
                onClick={() => editPlan(plan)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  );
};
