import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkWorkoutStatus,
  getMyTestimonial,
  getUserAppointments,
  getUserNotifications,
  getUserNutritionPlans,
  getUserProfile,
  getUserWorkouts,
} from "../../services/userServices";
import {
  setAppointmentR,
  setError,
  setLoading,
  setNutritions,
  setTestimonial,
  setTodayNutrition,
  setTodayWorkoutR,
  setTomorrowNutrition,
  setTomorrowWorkoutR,
  setUser,
  setWorkouts,
  updateWorkoutStatus,
} from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { WorkoutCard } from "../../components/user/WorkoutCardDashboard";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { NutritionCard } from "../../components/user/NutritionCardDashboard";
import { AppointmentCardDashboard } from "../../components/user/AppointmentCardDashboard";
import TestimonialCard from "../../components/user/TestimonialCard";


export const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get data from Redux store
  const {
    user,
    error,
    loading,
    appointments,
    progress,
    notifications,
    workouts,
    nutritionPlans,
    testimonial
    
  } = useSelector((state) => state.user);

  // Selected tab state
  const [activeTab, setActiveTab] = useState("today");

  // Process workouts to separate today and tomorrow
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [tomorrowWorkout, setTomorrowWorkout] = useState(null);

  const [todayNutritionPlan, setTodayNutritionPlan] = useState(null);
  const [todayNutritionData, setTodayNutritionData] = useState(null);

  const [tomorrowNutritionPlan, setTomorrowNutritionPlan] = useState(null);
  const userId=user?._id;
  // console.log("USERR ID : ",userId);
  
// console.log("inside userdashboard : user from redux : ", user);
// console.log("Mytestimonial dashboard !!",testimonial);



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));

        const profileResponse = await getUserProfile();
        // const progresstResponse = await getUserProgress();
        const appointmentResponse = await getUserAppointments();
        const notificationsRespoanse = await getUserNotifications();
        const workoutsResponse = await getUserWorkouts();
        const nutritionPlansResponse = await getUserNutritionPlans();
          const workoutStatusResp = await checkWorkoutStatus();
          // const testimonialResp = await getMyTestimonial();

        // console.log(" Profile : ", profileResponse.data.user);
        // console.log("workout response", workoutsResponse.data.data);
        // console.log("nutritionresponse", nutritionPlansResponse.data.data);
        // console.log("appointment response", appointmentResponse.data.data);
        // console.log("progress response", progresstResponse.data.data);
        // console.log("notification response", notificationsRespoanse.data.data);
        // console.log("workout status response", workoutStatusResp.data);

        dispatch(setUser(profileResponse.data));
        dispatch(setWorkouts(workoutsResponse.data.data));
        dispatch(setNutritions(nutritionPlansResponse.data.data));
        dispatch(setAppointmentR(appointmentResponse.data.data));
        if (workoutStatusResp.data.completedWorkouts.length > 0) {
          dispatch(updateWorkoutStatus({
            workoutId: workoutStatusResp.data.completedWorkouts[0],  // Get the workout ID
            status: workoutStatusResp.data.completed // The status (true/false)
          }));
        }
        // dispatch(updateWorkoutStatus(workoutStatusResp.data.completed));

        // console.log(" Profile : , profileResponse.data.user.testimonial ");
        dispatch(setTestimonial(profileResponse.data?.user.testimonial || null));
      //  console.log("Mytestimonial dashboard ",testimonial);
       
        


        // console.log("User in redux : ", user);
        // console.log("Workouts in redux new : ", workouts);
        // console.log("Nutritios in redux : ", nutritionPlans);
        // console.log("Appointments in redux : ", appointments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  // Process workouts when they change
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = tomorrow.toLocaleDateString("en-US", {
        weekday: "long",
      });

      // Find today's workout
      const todayWorkoutData = workouts.find((workout) =>
        workout.schedule.some((schedule) => schedule.day === today)
      );
      // console.log("Todayyyy ",todayWorkoutData);
      

      // Find tomorrow's workout
      const tomorrowWorkoutData = workouts.find((workout) =>
        workout.schedule.some((schedule) => schedule.day === tomorrowDay)
      );

      // console.log("TODAYS Workout : ", todayWorkoutData);
      // console.log("TOMORROW Workout : ", tomorrowWorkoutData);

      if (todayWorkoutData) {
        dispatch(setTodayWorkoutR(todayWorkoutData));
      }
      if(tomorrowWorkoutData){
        dispatch(setTomorrowWorkoutR(tomorrowWorkoutData))
      } 


      // Process today's workout data
      if (todayWorkoutData) {
        const todaySchedule = todayWorkoutData.schedule.find(
          (s) => s.day === today
        );
        setTodayWorkout({
          id: todayWorkoutData._id,
          title: todayWorkoutData.name,
          image:todayWorkoutData.image,
          description: todayWorkoutData.description,
          duration: todayWorkoutData.duration,
          difficulty: todayWorkoutData.difficulty,
          exercises: todaySchedule ? todaySchedule.exercises : [],
          completed: false, //  from user progress data
        });
      }

      // Process tomorrow's workout data
      if (tomorrowWorkoutData) {
        const tomorrowSchedule = tomorrowWorkoutData.schedule.find(
          (s) => s.day === tomorrowDay
        );
        setTomorrowWorkout({
          id: tomorrowWorkoutData._id,
          title: tomorrowWorkoutData.name,
          description: tomorrowWorkoutData.description,
          duration: tomorrowWorkoutData.duration,
          difficulty: tomorrowWorkoutData.difficulty,
          exercises: tomorrowSchedule ? tomorrowSchedule.exercises : [],
          completed: false,
        });
      }
    }
  }, [workouts]);




  useEffect(() => {
    if (nutritionPlans && nutritionPlans.length > 0) {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = tomorrow.toLocaleDateString("en-US", {
        weekday: "long",
      });

      // Find today's Nutrition
      const todayNutritionData = nutritionPlans.find((nutrition) =>
        nutrition.schedule.some((schedule) => schedule.day === today)
      );

      // Find tomorrow's Nutrition
      const tomorrowNutritionData = nutritionPlans.find((nutrition) =>
        nutrition.schedule.some((schedule) => schedule.day === tomorrowDay)
      );

      // console.log("TODAYS Nutrition : ", todayNutritionData);
      // console.log("TOMORROW Nutrition : ", tomorrowNutritionData);

if (todayNutritionData) {
  dispatch(setTodayNutrition(todayNutritionData));
}
if(tomorrowNutritionData){
  dispatch(setTomorrowNutrition(tomorrowNutritionData))
}     


      // Process today's Nutrition data
      if (todayNutritionData) {
        const todaySchedule = todayNutritionData.schedule.find(
          (s) => s.day === today
        );
        setTodayNutritionPlan({
          id: todayNutritionData._id,
          title: todayNutritionData.name,
          fitnessGoal: todayNutritionData.fitnessGoal,
          image: todayNutritionData.image,
          waterIntake: todayNutritionData.waterIntake,
          completed: false, //  set the completion status based on user progress 
        });

        setTodayNutritionData(todayNutritionData);
      }

      // Process tomorrow's nutrition data
      if (tomorrowNutritionData) {
        const tomorrowSchedule = tomorrowNutritionData.schedule.find(
          (s) => s.day === tomorrowDay
        );
        setTomorrowNutritionPlan({
          id: tomorrowNutritionData._id,
          title: tomorrowNutritionData.title,
          fitnessGoal: tomorrowNutritionData.fitnessGoal,
          image: tomorrowNutritionData.image,
          waterIntake: tomorrowNutritionData.waterIntake,
          completed: false,
        });
      }
      // console.log("Schedule data: ", todayNutritionPlan);
    }
  }, [nutritionPlans]);



  if (loading) {
    return (
    <LoadingSpinner/>
    );
  }

  return (
    <div className="flex min-h-screen">
  

      <div className="flex-1 p-6 bg-base-100">
        <h1 className="text-2xl font-bold ml-6 mb-6">
          {" "}
          Let's Achieve Your Goals!
        </h1>

        {/* Main Stat Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Workout */}
          <WorkoutCard todayWorkout={todayWorkout} />

          {/* Today's Nutrition */}
 <NutritionCard todayNutritionPlan={todayNutritionPlan} todayNutritionData={todayNutritionData} />

          {/* Upcoming Appointments */}
          <AppointmentCardDashboard appointments={appointments} />

       <TestimonialCard/>

         
        </div>

       
      </div>
    </div>
  );
};


