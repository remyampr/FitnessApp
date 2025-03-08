import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setNutritions, setProgress } from '../redux/userSlice'; // Adjust path as needed

export const NutritionPlanPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDay, setCurrentDay] = useState('');
  const [selectedNutrition, setSelectedNutrition] = useState(null);
  const [completedMeals, setCompletedMeals] = useState({});
  const [waterProgress, setWaterProgress] = useState(0);
  const [todayNutritionPlan, setTodayNutritionPlan] = useState(null);

  const dispatch = useDispatch();
  const { nutritionPlans, user } = useSelector((state) => state.user);

  useEffect(() => {
    // Get current day name
    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
    setCurrentDay(dayName);
    
    fetchNutritionPlans();
  }, []);

  // Process nutrition plans when they are available
  useEffect(() => {
    if (nutritionPlans && nutritionPlans.length > 0) {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      
      // Find today's Nutrition
      const todayNutritionData = nutritionPlans.find((nutrition) =>
        nutrition.schedule.some((schedule) => schedule.day === today)
      );
      
      // Process today's Nutrition data
      if (todayNutritionData) {
        const todaySchedule = todayNutritionData.schedule.find(
          (s) => s.day === today
        );
        
        setTodayNutritionPlan({
          id: todayNutritionData._id,
          title: todayNutritionData.name, // Using name field from your schema
          fitnessGoal: todayNutritionData.fitnessGoal,
          image: todayNutritionData.image,
          waterIntake: todayNutritionData.waterIntake,
          completed: false, // Will be updated based on progress
        });
        
        // Set the selected nutrition with today's meals
        setSelectedNutrition({
          ...todayNutritionData,
          todayMeals: todaySchedule.meals
        });
        
        // Initialize completed meals tracking
        const initialCompletedMeals = {};
        todaySchedule.meals.forEach((meal, index) => {
          initialCompletedMeals[index] = false;
        });
        setCompletedMeals(initialCompletedMeals);
      }
      
      setLoading(false);
    }
  }, [nutritionPlans]);

  const fetchNutritionPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/nutrition/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        dispatch(setNutritions(response.data.data));
      }
    } catch (err) {
      setError('Failed to fetch nutrition plans');
      setLoading(false);
    }
  };

  // Fetch user's progress for today to check if nutrition plan is already completed
  const fetchTodayProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const response = await axios.get(`/api/progress?date=${today}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success && response.data.data) {
        const progress = response.data.data;
        
        // Check if nutrition is already tracked for today
        if (progress.nutritionDetails && progress.nutritionDetails.length > 0) {
          // Find the entry for today's nutrition plan
          const nutritionProgress = progress.nutritionDetails.find(
            detail => detail.nutritionId === todayNutritionPlan.id
          );
          
          if (nutritionProgress) {
            // Update completed status
            setTodayNutritionPlan(prev => ({
              ...prev,
              completed: nutritionProgress.completed
            }));
            
            // Update water intake progress
            if (nutritionProgress.waterIntake) {
              const waterPercentage = (nutritionProgress.waterIntake / todayNutritionPlan.waterIntake) * 100;
              setWaterProgress(Math.min(waterPercentage, 100));
            }
            
            // Update completed meals if details are available
            if (nutritionProgress.details && nutritionProgress.details.completedMeals) {
              setCompletedMeals(nutritionProgress.details.completedMeals);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetching today's progress:", err);
    }
  };

  useEffect(() => {
    if (todayNutritionPlan) {
      fetchTodayProgress();
    }
  }, [todayNutritionPlan]);

  const handleMealComplete = (mealIndex) => {
    setCompletedMeals({
      ...completedMeals,
      [mealIndex]: !completedMeals[mealIndex]
    });
  };

  const updateWaterIntake = (increment) => {
    const newProgress = Math.min(Math.max(waterProgress + increment, 0), 100);
    setWaterProgress(newProgress);
  };

  const saveNutritionProgress = async () => {
    try {
      if (!todayNutritionPlan) {
        setError('No nutrition plan available to save progress');
        return;
      }
      
      // Check if any meal is completed
      const anyMealCompleted = Object.values(completedMeals).some(value => value);
      
      // Prepare nutrition details
      const nutritionDetails = {
        completedMeals: completedMeals,
        mealSummary: Object.entries(completedMeals)
          .filter(([_, isCompleted]) => isCompleted)
          .map(([index]) => selectedNutrition.todayMeals[index].type)
      };
      
      const progressData = {
        date: new Date().toISOString(),
        nutritionId: todayNutritionPlan.id,
        nutritionCompleted: anyMealCompleted,
        nutritionDetails: nutritionDetails,
        waterIntake: (waterProgress / 100) * todayNutritionPlan.waterIntake
      };
      
      const response = await axios.post('/api/progress/save', progressData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        dispatch(setProgress(response.data.data));
        
        // Update local state
        setTodayNutritionPlan(prev => ({
          ...prev,
          completed: anyMealCompleted
        }));
        
        // Show success alert
        alert('Nutrition progress saved successfully!');
      }
    } catch (err) {
      setError('Failed to save nutrition progress');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!selectedNutrition) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">No Nutrition Plan</h2>
          <p>There is no nutrition plan scheduled for today. Please contact your trainer.</p>
        </div>
      </div>
    );
  }

  // Calculate total nutrition values for today
  const totalNutrition = selectedNutrition.todayMeals.reduce((acc, meal) => {
    const mealTotals = meal.foods.reduce((mealAcc, food) => {
      return {
        calories: mealAcc.calories + food.calories,
        protein: mealAcc.protein + food.protein,
        carbs: mealAcc.carbs + food.carbs,
        fats: mealAcc.fats + food.fats
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    return {
      calories: acc.calories + mealTotals.calories,
      protein: acc.protein + mealTotals.protein,
      carbs: acc.carbs + mealTotals.carbs,
      fats: acc.fats + mealTotals.fats
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{currentDay}'s Nutrition Plan</h1>
        <p className="text-lg mt-2">Fitness Goal: {selectedNutrition.fitnessGoal}</p>
        {todayNutritionPlan?.completed && (
          <div className="badge badge-success badge-lg mt-2">Completed</div>
        )}
      </div>

      {/* Nutrition Overview Card */}
      <div className="card bg-primary text-primary-content shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl">Daily Nutrition Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-primary-focus rounded-lg p-4 text-center">
              <p className="text-xl font-bold">{totalNutrition.calories}</p>
              <p>Calories</p>
            </div>
            <div className="bg-primary-focus rounded-lg p-4 text-center">
              <p className="text-xl font-bold">{totalNutrition.protein}g</p>
              <p>Protein</p>
            </div>
            <div className="bg-primary-focus rounded-lg p-4 text-center">
              <p className="text-xl font-bold">{totalNutrition.carbs}g</p>
              <p>Carbs</p>
            </div>
            <div className="bg-primary-focus rounded-lg p-4 text-center">
              <p className="text-xl font-bold">{totalNutrition.fats}g</p>
              <p>Fats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Water Intake Card */}
      <div className="card bg-blue-600 text-white shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl">Water Intake Goal: {todayNutritionPlan?.waterIntake} liters</h2>
          <div className="mt-4">
            <progress 
              className="progress progress-accent w-full" 
              value={waterProgress} 
              max="100"
            ></progress>
            <p className="text-center mt-2">
              {((waterProgress / 100) * todayNutritionPlan?.waterIntake).toFixed(1)} / {todayNutritionPlan?.waterIntake} liters
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button className="btn btn-circle btn-accent" onClick={() => updateWaterIntake(-10)}>-</button>
            <button className="btn btn-circle btn-accent" onClick={() => updateWaterIntake(10)}>+</button>
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Today's Meals</h2>

        {selectedNutrition.todayMeals.map((meal, mealIndex) => (
          <div 
            key={`${meal.type}-${mealIndex}`} 
            className={`card shadow-xl ${completedMeals[mealIndex] ? 'bg-success text-success-content' : 'bg-base-100'}`}
          >
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h3 className="card-title text-xl capitalize">{meal.type}</h3>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Completed</span>
                    <input 
                      type="checkbox" 
                      checked={completedMeals[mealIndex] || false}
                      onChange={() => handleMealComplete(mealIndex)}
                      className="checkbox checkbox-success"
                    />
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Food</th>
                      <th>Quantity</th>
                      <th className="hidden md:table-cell">Calories</th>
                      <th className="hidden md:table-cell">Protein</th>
                      <th className="hidden md:table-cell">Carbs</th>
                      <th className="hidden md:table-cell">Fats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meal.foods.map((food, foodIndex) => (
                      <tr key={`${food.name}-${foodIndex}`}>
                        <td>{food.name}</td>
                        <td>{food.quantity}</td>
                        <td className="hidden md:table-cell">{food.calories}</td>
                        <td className="hidden md:table-cell">{food.protein}g</td>
                        <td className="hidden md:table-cell">{food.carbs}g</td>
                        <td className="hidden md:table-cell">{food.fats}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Progress Button */}
      <div className="mt-8 text-center">
        <button 
          className="btn btn-lg btn-primary"
          onClick={saveNutritionProgress}
        >
          Save Today's Progress
        </button>
      </div>
    </div>
  );
};

