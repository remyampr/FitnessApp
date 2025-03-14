import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setProgress } from "../../redux/features/userSlice";
import { AlertError } from "../../components/shared/AlertError";
import {
  getProgressHistory,
  getProgressSummary,
} from "../../services/userServices";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export const UserProgressPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user data from Redux
  const userId = useSelector((state) => state.user.user);
  const progress = useSelector((state) => state.user?.progress);
  const nutritionPlans = useSelector((state) => state.user?.nutritionPlans);
  // console.log("Inside ProgressPage : datas from Redux:", {
  //   userID: userId,
  //   progress: progress,
  //   nutritionPlans: nutritionPlans,
  // });

  // Fetch progress data when component mounts
  useEffect(() => {
    const fetchProgressData = async () => {
      if (userId) {
        setLoading(true);
        try {
          const summaryResponse = await getProgressSummary();
          const historyResponse = await getProgressHistory();

          // console.log("Summary response:", summaryResponse);
          // console.log("History response:", historyResponse);

          const progressData = {
            summary: summaryResponse.data,
            history: historyResponse.data,
            currentProgress: progress?.currentProgress || null,
            workoutStatus: progress?.workoutStatus || {},
            activeDays: progress?.summary?.data?.totalWorkoutsCompleted || 0,
          };

          dispatch(setProgress(progressData));
        } catch (error) {
          console.error("Error fetching progress data:", err);
          setError("Failed to load progress data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProgressData();
  }, [userId, dispatch]);

  useEffect(() => {
    // console.log("inside ProgressPage (in redux form progress )History Data:", progress?.history?.data);
    // console.log("inside ProgressPage (in redux form progress )summary Data:", progress?.summary?.data);
    console.log(
      "inside ProgressPage (in redux form progress )progress:",
      progress
    );

    console.log(
      "inside ProgressPage (in redux form progress )nutritionDetails:",
      progress.history.data.map((item) => item.nutritionDetails)
    );
  }, [progress]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <AlertError error={error} />;
  }

  return (
    <div className="container mx-auto  p-4 flex">


 <div className="w-4/5">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>

      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === "summary" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </a>
        <a
          className={`tab ${activeTab === "workouts" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("workouts")}
        >
          Workouts
        </a>
        <a
          className={`tab ${activeTab === "nutrition" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("nutrition")}
        >
          Nutrition
        </a>
        {/* <a
          className={`tab ${activeTab === "measurements" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("measurements")}
        >
          Measurements
        </a> */}
      </div>

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Workouts Completed</h3>
              <p className="text-3xl font-bold">
                {progress?.summary?.data.totalWorkoutsCompleted || 0}
              </p>
              <p className="text-sm opacity-70">Last 30 days</p>
            </div>

            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Nutrition Adherence</h3>
              <p className="text-3xl font-bold">
                {progress?.summary?.data?.nutritionAdherence || "0"} %
              </p>
              {/* <p className="text-sm opacity-70">Last 7 days</p> */}
            </div>

            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Active Days</h3>

              <p className="text-3xl font-bold">{progress?.activeDays || 0}</p>
              <p className="text-sm opacity-70">This month</p>
            </div>
          </div>

          <div className="bg-base-200 p-4 rounded-lg shadow mb-6">
            <h3 className="font-bold mb-2">Recent Activity</h3>

            {(() => {
              // Collect all nutrition and workout activities
              const combinedActivities = (progress?.history?.data || []).reduce(
                (acc, item) => {
                  // Extract nutritionFollowed and workoutCompleted from each progress record
                  if (Array.isArray(item?.nutritionFollowed)) {
                    item.nutritionFollowed.forEach((activity) => {
                      acc.push({
                        activityType: "Nutrition",
                        name: activity.name,
                        date: item.date, // Use the date from the parent data
                      });
                    });
                  }

                  if (Array.isArray(item?.workoutCompleted)) {
                    item.workoutCompleted.forEach((activity) => {
                      acc.push({
                        activityType: "Workout",
                        name: activity.name,
                        date: item.date, // Use the date from the parent data
                      });
                    });
                  }

                  return acc;
                },
                []
              );

              // Sort all activities by date, most recent first
              const sortedActivities = combinedActivities.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              );

              // Show the most recent 3 activities
              return sortedActivities.length > 0 ? (
                sortedActivities.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="mb-3 border-b border-base-300 pb-3 last:border-b-0"
                  >
                    <p className="font-bold">
                      {item.activityType}: {item.name}
                    </p>
                    <p className="text-sm opacity-70">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No recent activity to display</p>
              );
            })()}
          </div>

          {/* 
          <div className="bg-base-200 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Next Goals</h3>
            <ul className="list-disc pl-5">
              <li className="mb-2">Complete 3 workouts this week</li>
              <li className="mb-2">Follow nutrition plan for 5 days</li>
              <li className="mb-2">Log measurements on Sunday</li>
            </ul>
          </div> */}
        </div>
      )}

      {/* Workouts Tab */}
      {activeTab === "workouts" && (
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
                {progress?.history?.data?.length > 0 ? (
                  progress.history.data.map((historyItem, index) => {
                    // Iterate over each workoutDetails array inside the data
                    return historyItem.workoutDetails.map(
                      (workout, workoutIndex) => (
                        <tr key={`${index}-${workoutIndex}`}>
                          <td>
                            {new Date(workout.completedAt).toLocaleDateString()}
                          </td>
                          <td>
                            {/* Display all exercises */}
                            {workout.exercises &&
                              workout.exercises.length > 0 &&
                              workout.exercises.map(
                                (exercise, exerciseIndex) => (
                                  <div key={exerciseIndex}>{exercise.name}</div>
                                )
                              )}
                          </td>
                          <td>{workout.duration}</td>
                          <td>
                            {workout.completed ? (
                              <span className="badge badge-success">
                                Completed
                              </span>
                            ) : (
                              <span className="badge badge-warning">
                                Partial
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No workout history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* <h2 className="text-xl font-bold mt-6 mb-4">Performance Trends</h2> */}
          <div className="bg-base-200 p-4 rounded-lg shadow">
            {/* Add chart components here */}
            {/* Example: Weekly workout completion, exercise performance over time, etc. */}
          </div>
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === "nutrition" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Nutrition Tracking</h2>

          {progress.history.data.map((entry, index) =>
            entry.nutritionDetails?.map((detail, detailIndex) => (
              <div
                key={`${index}-${detailIndex}`}
                className="bg-base-200 p-4 rounded-lg shadow mb-4"
              >
                <h3 className="font-bold mb-2">
                  Nutrition Entry {index + 1} -{" "}
                  {new Date(detail.completedAt).toLocaleDateString()}
                </h3>
                <p>Water Intake: {detail.details?.waterIntake || 0} oz</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detail.details?.meals?.map((meal, mealIndex) => (
                    <div
                      key={`${index}-${detailIndex}-${mealIndex}`}
                      className="p-2 border rounded-lg"
                    >
                      <h4 className="font-bold text-lg">{meal.type}</h4>

                      {meal.foods.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {meal.foods.map((food, foodIndex) => (
                            <li
                              key={`${index}-${detailIndex}-${mealIndex}-${foodIndex}`}
                              className="text-sm"
                            >
                              {food.name} - {food.calories} cal, {food.protein}g
                              Protein, {food.carbs}g Carbs, {food.fats}g Fats
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">
                          No nutrition data available
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Measurements Tab */}
      {activeTab === "measurements" && (
        <div>
          {/* <h2 className="text-xl font-bold mb-4">Body Measurements</h2> */}

    

          <h2 className="font-bold mb-2">Measurement History</h2>
         
        </div>
      )}
    </div>
    </div>
  );
};
