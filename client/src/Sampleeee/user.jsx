





// *************************************************







 {/* Main Stat Cards */}


   {/* Secondary Content - Tabs */}
<div className="mt-8">
<div className="tabs tabs-boxed mb-4">
  <a
    className={`tab ${activeTab === "today" ? "tab-active" : ""}`}
    onClick={() => setActiveTab("today")}
  >
    Today
  </a>
  <a
    className={`tab ${activeTab === "tomorrow" ? "tab-active" : ""}`}
    onClick={() => setActiveTab("tomorrow")}
  >
    Tomorrow
  </a>
  <a
    className={`tab ${activeTab === "progress" ? "tab-active" : ""}`}
    onClick={() => setActiveTab("progress")}
  >
    Progress
  </a>
</div>

{/* Tab Content - Today */}
{activeTab === "today" && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Today's Detailed Workout */}
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title">Today's Workout Details</h3>
        {todayWorkout ? (
          <>
            <p>{todayWorkout.description}</p>
            <p className="font-semibold mt-2">Exercises:</p>
            <ul className="list-disc pl-5">
              {todayWorkout?.exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name}: {exercise.sets} sets ×{" "}
                  {exercise.reps} reps
                  {exercise.restTime
                    ? ` (Rest: ${exercise.restTime}s)`
                    : ""}
                  {exercise.notes ? ` - Note: ${exercise.notes}` : ""}
                </li>
              ))}
            </ul>
            <div className="card-actions justify-end mt-4">
              <button
                onClick={() =>
                  handleMarkWorkoutCompleted(todayWorkout.id)
                }
                className="btn btn-sm btn-success"
                disabled={todayWorkout.completed}
              >
                {todayWorkout.completed
                  ? "Completed"
                  : "Mark Completed"}
              </button>
            </div>
          </>
        ) : (
          <p>No workout scheduled for today</p>
        )}
      </div>
    </div>

    {/* Today's Detailed Nutrition */}
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title">Today's Nutrition Details</h3>
        {nutrition && nutrition.today ? (
          <div>
            <p className="font-bold mt-2">Breakfast:</p>
            <p>
              {nutrition.today.breakfast} -{" "}
              {nutrition.today.breakfastCalories} calories
            </p>

            <p className="font-bold mt-2">Lunch:</p>
            <p>
              {nutrition.today.lunch} - {nutrition.today.lunchCalories}{" "}
              calories
            </p>

            <p className="font-bold mt-2">Dinner:</p>
            <p>
              {nutrition.today.dinner} -{" "}
              {nutrition.today.dinnerCalories} calories
            </p>

            <div className="card-actions justify-end mt-4">
              <button
                onClick={() => console.log("Log meals")}
                className="btn btn-sm btn-success"
              >
                Log Meals
              </button>
            </div>
          </div>
        ) : (
          <p>No meal plan for today</p>
        )}
      </div>
    </div>
  </div>
)}

{/* Tab Content - Tomorrow */}
{activeTab === "tomorrow" && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Tomorrow's Workout */}
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title">Tomorrow's Workout</h3>
        {tomorrowWorkout ? (
          <>
            <p className="font-semibold">
              {tomorrowWorkout.title} - {tomorrowWorkout.duration} min
            </p>
            <p>{tomorrowWorkout.description}</p>
            <p className="font-semibold mt-2">Exercises:</p>
            <ul className="list-disc pl-5">
              {tomorrowWorkout.exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name}: {exercise.sets} sets ×{" "}
                  {exercise.reps} reps
                  {exercise.restTime
                    ? ` (Rest: ${exercise.restTime}s)`
                    : ""}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No workout scheduled for tomorrow</p>
        )}
      </div>
    </div>

    {/* Tomorrow's Nutrition */}
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title">Tomorrow's Nutrition</h3>
        {nutrition && nutrition.tomorrow ? (
          <div>
            <p className="font-bold mt-2">Breakfast:</p>
            <p>
              {nutrition.tomorrow.breakfast} -{" "}
              {nutrition.tomorrow.breakfastCalories} calories
            </p>

            <p className="font-bold mt-2">Lunch:</p>
            <p>
              {nutrition.tomorrow.lunch} -{" "}
              {nutrition.tomorrow.lunchCalories} calories
            </p>

            <p className="font-bold mt-2">Dinner:</p>
            <p>
              {nutrition.tomorrow.dinner} -{" "}
              {nutrition.tomorrow.dinnerCalories} calories
            </p>
          </div>
        ) : (
          <p>No meal plan for tomorrow</p>
        )}
      </div>
    </div>
  </div>
)}

{/* Tab Content - Progress */}
{activeTab === "progress" && (
  <div className="card bg-base-100 shadow-lg">
    <div className="card-body">
      <h3 className="card-title">Your Progress</h3>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-4xl font-bold">
              {stats.workoutsCompleted || 0}
            </p>
            <p className="text-sm">Workouts Completed</p>
          </div>
          <div className="stat-card p-4 bg-success/10 rounded-lg text-center">
            <p className="text-4xl font-bold">
              {stats.caloriesBurned || 0}
            </p>
            <p className="text-sm">Calories Burned</p>
          </div>
          <div className="stat-card p-4 bg-info/10 rounded-lg text-center">
            <p className="text-4xl font-bold">
              {stats.nutritionAdherence || 0}%
            </p>
            <p className="text-sm">Nutrition Adherence</p>
          </div>
        </div>
      ) : (
        <p>No progress data available</p>
      )}
    </div>
  </div>
)}
</div>












// **********************************************

// ProgressPage
// *************************************************
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProgressHistory, getProgressSummary } from '../services/progressService';
import { setProgress } from '../redux/userSlice';

const UserProgressPag = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user data from Redux
  const userId = useSelector(state => state.user?.userId);
  const progress = useSelector(state => state.user?.progress);
  const nutritionPlans = useSelector(state => state.user?.nutritionPlans);
  
  // Fetch progress data when component mounts
  useEffect(() => {
    if (userId) {
      setLoading(true);
      
      // Fetch progress summary
      Promise.all([
        getProgressSummary(),
        getProgressHistory()
      ])
        .then(([summaryResponse, historyResponse]) => {
          const progressData = {
            summary: summaryResponse.data,
            history: historyResponse.data,
            currentProgress: progress?.currentProgress || null,
            workoutStatus: progress?.workoutStatus || {}
          };
          
          dispatch(setProgress(progressData));
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching progress data:', err);
          setError('Failed to load progress data. Please try again.');
          setLoading(false);
        });
    }
  }, [userId, dispatch]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>
      
      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'summary' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </a>
        <a 
          className={`tab ${activeTab === 'workouts' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts
        </a>
        <a 
          className={`tab ${activeTab === 'nutrition' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          Nutrition
        </a>
        <a 
          className={`tab ${activeTab === 'measurements' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('measurements')}
        >
          Measurements
        </a>
      </div>
      
      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Workouts Completed</h3>
              <p className="text-3xl font-bold">{progress?.summary?.totalWorkouts || 0}</p>
              <p className="text-sm opacity-70">Last 30 days</p>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Nutrition Adherence</h3>
              <p className="text-3xl font-bold">{progress?.summary?.nutritionAdherence || '0%'}</p>
              <p className="text-sm opacity-70">Last 7 days</p>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Active Days</h3>
              <p className="text-3xl font-bold">{progress?.summary?.activeDays || 0}</p>
              <p className="text-sm opacity-70">This month</p>
            </div>
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg shadow mb-6">
            <h3 className="font-bold mb-2">Recent Activity</h3>
            {(progress?.history?.slice(0, 3) || []).map((item, index) => (
              <div key={index} className="mb-3 border-b border-base-300 pb-3 last:border-b-0">
                <p className="font-bold">{item.activityType}: {item.name}</p>
                <p className="text-sm opacity-70">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            ))}
            {(!progress?.history || progress.history.length === 0) && (
              <p>No recent activity to display</p>
            )}
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Next Goals</h3>
            <ul className="list-disc pl-5">
              <li className="mb-2">Complete 3 workouts this week</li>
              <li className="mb-2">Follow nutrition plan for 5 days</li>
              <li className="mb-2">Log measurements on Sunday</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Workouts Tab */}
      {activeTab === 'workouts' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Workout History</h2>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Workout</th>
                  <th>Duration</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {(progress?.history?.filter(item => item.activityType === 'workout') || []).map((workout, index) => (
                  <tr key={index}>
                    <td>{new Date(workout.date).toLocaleDateString()}</td>
                    <td>{workout.name}</td>
                    <td>{workout.duration} min</td>
                    <td>
                      {workout.completed ? (
                        <span className="badge badge-success">Completed</span>
                      ) : (
                        <span className="badge badge-warning">Partial</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!progress?.history || progress.history.filter(item => item.activityType === 'workout').length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center">No workout history available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <h2 className="text-xl font-bold mt-6 mb-4">Performance Trends</h2>
          <div className="bg-base-200 p-4 rounded-lg shadow">
            <p>Visualizations and charts would go here</p>
            {/* 
              You could add chart components here, such as:
              - Weekly workout completion
              - Exercise performance over time
              - Workout intensity tracking
            */}
          </div>
        </div>
      )}
      
      {/* Nutrition Tab */}
      {activeTab === 'nutrition' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Nutrition Tracking</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Daily Calories</h3>
              <div className="flex justify-between items-center mb-2">
                <span>Target: {nutritionPlans?.[0]?.dailyCalories || 2000} cal</span>
                <span>Average: {progress?.summary?.averageCalories || 0} cal</span>
              </div>
              <progress 
                className="progress progress-accent w-full" 
                value={progress?.summary?.calorieAdherence || 0} 
                max="100"
              ></progress>
              <p className="text-right text-sm">{progress?.summary?.calorieAdherence || 0}% adherence</p>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Macronutrients</h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-sm">Protein</p>
                  <p className="font-bold">{progress?.summary?.averageProtein || 0}g</p>
                  <progress 
                    className="progress progress-success w-full" 
                    value={progress?.summary?.proteinAdherence || 0} 
                    max="100"
                  ></progress>
                </div>
                <div>
                  <p className="text-sm">Carbs</p>
                  <p className="font-bold">{progress?.summary?.averageCarbs || 0}g</p>
                  <progress 
                    className="progress progress-warning w-full" 
                    value={progress?.summary?.carbsAdherence || 0} 
                    max="100"
                  ></progress>
                </div>
                <div>
                  <p className="text-sm">Fats</p>
                  <p className="font-bold">{progress?.summary?.averageFat || 0}g</p>
                  <progress 
                    className="progress progress-error w-full" 
                    value={progress?.summary?.fatAdherence || 0} 
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="font-bold mb-2">Meal Plan Adherence</h3>
          <div className="overflow-x-auto mb-6">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Plan Followed</th>
                  <th>Calories</th>
                  <th>Water Intake</th>
                </tr>
              </thead>
              <tbody>
                {(progress?.history?.filter(item => item.activityType === 'nutrition') || []).map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>
                      {entry.planFollowed ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-error">No</span>
                      )}
                    </td>
                    <td>{entry.calories} cal</td>
                    <td>{entry.waterIntake || 0} oz</td>
                  </tr>
                ))}
                {(!progress?.history || progress.history.filter(item => item.activityType === 'nutrition').length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center">No nutrition data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Current Nutrition Plan</h3>
            {nutritionPlans && nutritionPlans.length > 0 ? (
              <div>
                <p className="mb-2">{nutritionPlans[0].name}</p>
                <p className="mb-2">Daily target: {nutritionPlans[0].dailyCalories} calories</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm">Protein: {nutritionPlans[0].protein}g</p>
                  </div>
                  <div>
                    <p className="text-sm">Carbs: {nutritionPlans[0].carbs}g</p>
                  </div>
                  <div>
                    <p className="text-sm">Fats: {nutritionPlans[0].fats}g</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No active nutrition plan found</p>
            )}
          </div>
        </div>
      )}
      
      {/* Measurements Tab */}
      {activeTab === 'measurements' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Body Measurements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Weight Tracking</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Starting</p>
                  <p className="font-bold">{progress?.summary?.startingWeight || '0'} lbs</p>
                </div>
                <div>
                  <p className="text-sm">Current</p>
                  <p className="font-bold">{progress?.summary?.currentWeight || '0'} lbs</p>
                </div>
                <div>
                  <p className="text-sm">Goal</p>
                  <p className="font-bold">{progress?.summary?.goalWeight || '0'} lbs</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm">Progress to goal</p>
                <progress 
                  className="progress progress-accent w-full" 
                  value={progress?.summary?.weightProgressPercentage || 0} 
                  max="100"
                ></progress>
                <p className="text-right text-sm">
                  {progress?.summary?.weightChange > 0 ? '+' : ''}
                  {progress?.summary?.weightChange || '0'} lbs
                </p>
              </div>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Body Composition</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Body Fat %</p>
                  <p className="font-bold">{progress?.summary?.bodyFatPercentage || '0'}%</p>
                  <p className="text-xs opacity-70">
                    {progress?.summary?.bodyFatChange > 0 ? '+' : ''}
                    {progress?.summary?.bodyFatChange || '0'}% from start
                  </p>
                </div>
                <div>
                  <p className="text-sm">Muscle Mass</p>
                  <p className="font-bold">{progress?.summary?.muscleMass || '0'} lbs</p>
                  <p className="text-xs opacity-70">
                    {progress?.summary?.muscleMassChange > 0 ? '+' : ''}
                    {progress?.summary?.muscleMassChange || '0'} lbs from start
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="font-bold mb-2">Measurement History</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Body Fat</th>
                  <th>Other Measurements</th>
                </tr>
              </thead>
              <tbody>
                {(progress?.history?.filter(item => item.activityType === 'measurement') || []).map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>{entry.weight} lbs</td>
                    <td>{entry.bodyFat || 'N/A'}%</td>
                    <td>
                      <details className="dropdown">
                        <summary className="btn btn-xs">View</summary>
                        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                          <li><a>Chest: {entry.measurements?.chest || 'N/A'}"</a></li>
                          <li><a>Waist: {entry.measurements?.waist || 'N/A'}"</a></li>
                          <li><a>Hips: {entry.measurements?.hips || 'N/A'}"</a></li>
                          <li><a>Arms: {entry.measurements?.arms || 'N/A'}"</a></li>
                          <li><a>Thighs: {entry.measurements?.thighs || 'N/A'}"</a></li>
                        </ul>
                      </details>
                    </td>
                  </tr>
                ))}
                {(!progress?.history || progress.history.filter(item => item.activityType === 'measurement').length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center">No measurement data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};



// ********************************************



