


  // NutritionPlanPage Withstyle
  import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { saveProgress } from "../../services/userServices";
import { toast } from "react-toastify";

export const NutritionPlanPag = () => {
  const location = useLocation();
  const { nutrition, fullNutritionData } = location.state || {};
  const [waterIntake, setWaterIntake] = useState(0);
  const [meals, setMeals] = useState([]);
  const user = useSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Initialize meals from fullNutritionData
    if (fullNutritionData && fullNutritionData.schedule) {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const todaySchedule = fullNutritionData.schedule.find(
        s => s.day === today
      );
      
      if (todaySchedule && todaySchedule.meals) {
        setMeals(todaySchedule.meals.map(meal => ({
          ...meal,
          completed: false
        })));
      }
    }
  }, [fullNutritionData]);
  
  const handleMealToggle = (mealIndex) => {
    setMeals(prevMeals => 
      prevMeals.map((meal, index) => 
        index === mealIndex ? { ...meal, completed: !meal.completed } : meal
      )
    );
  };
  
  const updateWaterIntake = (amount) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  };
  
  const saveNutritionProgress = async () => {
    if (!user || !fullNutritionData) return;
    
    setIsLoading(true);
    
    try {
      const nutritionCompleted = {
        userId: user.id,
        nutritionId: fullNutritionData.id,
        nutritionCompleted: meals.every(meal => meal.completed),
        nutritionDetails: {
          meals: meals.map(meal => ({
            name: meal.food ? meal.food.name : meal.name,
            completed: meal.completed,
            time: meal.time
          }))
        },
        waterIntake
      };
      
      const response = await saveProgress(nutritionCompleted);
      console.log("Nutrition Progress save Response : ", response);
      
      // Show success message
      toast.success('Nutrition progress saved successfully!');
    } catch (error) {
      console.error('Error saving nutrition progress:', error);
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {fullNutritionData?.title || 'Nutrition Plan'}
        </h1>
        <p className="text-sm text-base-content/70">Track your daily nutrition goals</p>
      </div>
      
      {/* Water Intake Card */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title flex items-center text-xl">
            <span className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </span>
            Water Intake
          </h2>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">
              {waterIntake} / {fullNutritionData?.waterIntake || 8} liters
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => updateWaterIntake(-0.25)} 
                className="btn btn-circle btn-sm btn-outline"
              >
                -
              </button>
              <button 
                onClick={() => updateWaterIntake(0.25)} 
                className="btn btn-circle btn-sm btn-primary text-white"
              >
                +
              </button>
            </div>
          </div>
          
          <progress 
            className="progress progress-primary w-full" 
            value={waterIntake} 
            max={fullNutritionData?.waterIntake || 8}
          ></progress>
          
          <div className="flex justify-between text-xs text-base-content/70 mt-1">
            <span>0L</span>
            <span>{fullNutritionData?.waterIntake || 8}L</span>
          </div>
        </div>
      </div>
      
      {/* Meals Section */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title flex items-center text-xl">
            <span className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Today's Meals
          </h2>
          
          {meals.length > 0 ? (
            <div className="divide-y divide-base-300">
              {meals.map((meal, index) => (
                <div 
                  key={index} 
                  className={`py-4 transition-all duration-300 ${
                    meal.completed ? 'bg-base-200/50 opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className={`text-lg font-medium ${meal.completed ? 'line-through text-base-content/70' : ''}`}>
                          {meal.name || (meal.food && meal.food.name) || 'Unnamed Meal'}
                        </h3>
                        <span className="badge badge-primary ml-2">{meal.time}</span>
                      </div>
                      
                      {meal.foods && meal.foods.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {meal.foods.map((food, foodIndex) => (
                            <li key={foodIndex} className="flex items-center text-sm text-base-content/70">
                              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                              {food.name} - {food.quantity} {food.unit}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <label className="swap">
                      <input
                        type="checkbox"
                        checked={meal.completed}
                        onChange={() => handleMealToggle(index)}
                        className="hidden"
                      />
                      <div className={`swap-on btn btn-circle btn-sm btn-primary text-white`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className={`swap-off btn btn-circle btn-sm btn-outline`}>✓</div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>No meals available for today</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Stats Card */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl">Daily Progress</h2>
          
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Meals Completed</div>
              <div className="stat-value text-primary">{meals.filter(m => m.completed).length}/{meals.length}</div>
              <div className="stat-desc">
                {meals.length > 0 
                  ? `${Math.round((meals.filter(m => m.completed).length / meals.length) * 100)}% complete` 
                  : 'No meals scheduled'}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Water Goal</div>
              <div className="stat-value text-secondary">
                {fullNutritionData?.waterIntake 
                  ? `${Math.round((waterIntake / fullNutritionData.waterIntake) * 100)}%` 
                  : '0%'}
              </div>
              <div className="stat-desc">{waterIntake} of {fullNutritionData?.waterIntake || 8}L</div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
        onClick={saveNutritionProgress}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Progress'}
      </button>
    </div>
  );
};





    {/* Nutrition Tab */}
    // {activeTab === "nutrition" && (
    //   <div>
    //     <h2 className="text-xl font-bold mb-4">Nutrition Tracking</h2>

    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    //       <div className="bg-base-200 p-4 rounded-lg shadow">
    //         <h3 className="font-bold mb-2">Daily Calories</h3>
    //         <div className="flex justify-between items-center mb-2">
    //           <span>
    //             Target:{" "}
    //             {history.data.nutritionDetails?.[0]?.dailyCalories || 2000}{" "}
    //             cal
    //           </span>
    //           <span>
    //             Average: {progress?.summary?.averageCalories || 0} cal
    //           </span>
    //         </div>
    //         <progress
    //           className="progress progress-accent w-full"
    //           value={progress?.summary?.calorieAdherence || 0}
    //           max="100"
    //         ></progress>
    //         <p className="text-right text-sm">
    //           {progress?.summary?.calorieAdherence || 0}% adherence
    //         </p>
    //       </div>

    //       <div className="bg-base-200 p-4 rounded-lg shadow">
    //         <h3 className="font-bold mb-2">Macronutrients</h3>
    //         <div className="grid grid-cols-3 gap-2">
    //           <div>
    //             <p className="text-sm">Protein</p>
    //             <p className="font-bold">
    //               {progress?.summary?.averageProtein || 0}g
    //             </p>
    //             <progress
    //               className="progress progress-success w-full"
    //               value={progress?.summary?.proteinAdherence || 0}
    //               max="100"
    //             ></progress>
    //           </div>
    //           <div>
    //             <p className="text-sm">Carbs</p>
    //             <p className="font-bold">
    //               {progress?.summary?.averageCarbs || 0}g
    //             </p>
    //             <progress
    //               className="progress progress-warning w-full"
    //               value={progress?.summary?.carbsAdherence || 0}
    //               max="100"
    //             ></progress>
    //           </div>
    //           <div>
    //             <p className="text-sm">Fats</p>
    //             <p className="font-bold">
    //               {progress?.summary?.averageFat || 0}g
    //             </p>
    //             <progress
    //               className="progress progress-error w-full"
    //               value={progress?.summary?.fatAdherence || 0}
    //               max="100"
    //             ></progress>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <h3 className="font-bold mb-2">Meal Plan Adherence</h3>
    //     <div className="overflow-x-auto mb-6">
    //       <table className="table table-zebra w-full">
    //         <thead>
    //           <tr>
    //             <th>Date</th>
    //             <th>Plan Followed</th>
    //             <th>Calories</th>
    //             <th>Water Intake</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {(
    //             progress?.history?.filter(
    //               (item) => item.activityType === "nutrition"
    //             ) || []
    //           ).map((entry, index) => (
    //             <tr key={index}>
    //               <td>{new Date(entry.date).toLocaleDateString()}</td>
    //               <td>
    //                 {entry.planFollowed ? (
    //                   <span className="badge badge-success">Yes</span>
    //                 ) : (
    //                   <span className="badge badge-error">No</span>
    //                 )}
    //               </td>
    //               <td>{entry.calories} cal</td>
    //               <td>{entry.waterIntake || 0} oz</td>
    //             </tr>
    //           ))}
    //           {(!progress?.history ||
    //             progress.history.filter(
    //               (item) => item.activityType === "nutrition"
    //             ).length === 0) && (
    //             <tr>
    //               <td colSpan="4" className="text-center">
    //                 No nutrition data available
    //               </td>
    //             </tr>
    //           )}
    //         </tbody>
    //       </table>
    //     </div>

    //     <div className="bg-base-200 p-4 rounded-lg shadow">
    //       <h3 className="font-bold mb-2">Current Nutrition Plan</h3>
    //       {nutritionPlans && nutritionPlans.length > 0 ? (
    //         <div>
    //           <p className="mb-2">{nutritionPlans[0].name}</p>
    //           <p className="mb-2">
    //             Daily target: {nutritionPlans[0].dailyCalories} calories
    //           </p>
    //           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
    //             <div>
    //               <p className="text-sm">
    //                 Protein: {nutritionPlans[0].protein}g
    //               </p>
    //             </div>
    //             <div>
    //               <p className="text-sm">Carbs: {nutritionPlans[0].carbs}g</p>
    //             </div>
    //             <div>
    //               <p className="text-sm">Fats: {nutritionPlans[0].fats}g</p>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <p>No active nutrition plan found</p>
    //       )}
    //     </div>
    //   </div>
    // )}








