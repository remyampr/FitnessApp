import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkWorkoutStatus } from "../../services/userServices";
import { setWorkoutInProgress, updateWorkoutStatus } from "../../redux/features/userSlice";
import { LoadingSpinner } from "../shared/LoadingSpinner";

export const WorkoutCard = ({ todayWorkout}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const workoutStatus = useSelector(state => 
    state.user?.progress?.workoutStatus?.[todayWorkout?.id] || 'pending'
 
  );
  const userId=useSelector(state => state.user?.user?.user?._id);

//   console.log("inside workoutCard from redux todayWorkout:", todayWorkout);
//   console.log("inside workoutCard from redux workoutstatus:::", workoutStatus);
// console.log("inside workoutCard userId:", userId);


  useEffect(() => {
    const fetchWorkoutstatus = async () => {
      if (todayWorkout && userId) {
        setIsLoading(true);
        try {
          const workoutStatusResp = await checkWorkoutStatus();
          const data = workoutStatusResp.data;
          // console.log(" inside use Effect of Workout card : Workout status response:", data);

          if (
            data.completedWorkouts &&
            data.completedWorkouts.includes(todayWorkout.id)
          ) {
            // console.log("dispatching workout status...");
            
            dispatch(
              updateWorkoutStatus({
                workoutId: todayWorkout.id,
                status: "completed",
              })
            );
          } else if (
            data.inProgressWorkouts &&
            data.inProgressWorkouts.includes(todayWorkout.id)
          ) {
            dispatch(
              updateWorkoutStatus({
                workoutId: todayWorkout.id,
                status: "inProgress",
              })
            );
          } else {
            dispatch(
              updateWorkoutStatus({
                workoutId: todayWorkout.id,
                status: "pending",
              })
            );
          }
        } catch (error) {
          console.error('Error checking workout status:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchWorkoutstatus();
  }, [dispatch, todayWorkout, userId]);



  const handleStartWorkout = () => {
    // Update Redux state to mark workout as in progress
    dispatch(setWorkoutInProgress({ workoutId: todayWorkout._id }));

    // Navigate to workout page
    navigate("/user/workout/start", {
      state: { workout: todayWorkout },
    });
  };



  const handleResumeWorkout = () => {
    // console.log("Navigating to /user/workout/start")
     navigate("/user/workout/start", {
      state: { workout: todayWorkout },
    });
  };

  

  const getStatusButton = () => {
    if (isLoading) {
      return (
     <LoadingSpinner/>
      );
    }
    switch (workoutStatus) {
   
      case "completed":
        return (
       
          
          <button className="btn btn-success btn-disabled" disabled>
            Completed ✓
          </button>
        );
      case "inProgress":
        return (
          <button onClick={handleResumeWorkout} className="btn btn-warning">
            Resume Workout
          </button>
        );
      default:
        return (
          <button onClick={handleStartWorkout} className="btn btn-accent">
            Start Now
          </button>
        );
    }
  };

  return (
    <div className="card bg-primary text-primary-content shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Today's Workout</h2>
        {todayWorkout ? (
          <>
            <p>
              <img src="/workout.png" alt="" />
               {todayWorkout.name} - {todayWorkout.duration} min
            </p>
            <p className="text-sm">Difficulty: {todayWorkout.difficulty}</p>
            <div className="mt-2">{getStatusButton()}</div>
            {workoutStatus === "completed" && (
              <div className="mt-2">
                <a
                  onClick={() => navigate("/user/progress")}
                  className="link link-hover text-sm"
                >
                  View your progress →
                </a>
              </div>
            )}
          </>
        ) : (
          <p>No workout scheduled for today</p>
        )}
      </div>
    </div>
  );
};








