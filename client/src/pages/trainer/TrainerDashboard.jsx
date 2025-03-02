import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAppointments,
  setClients,
  setError,
  setLoading,
  setNutritionPlans,
  setRevenue,
  setRevenueHistory,
  setTrainerDashboardStats,
  setTrainerProfile,
  setWorkouts,
} from "../../redux/features/trainerSlice";
import {
  getAppointmentForTrainer,
  getClients,
  getProfile,
  getTrainerNutritionPlans,
  getTrainerRevenue,
  getTrainerWorkouts,
} from "../../services/trainerServices";
import { StatsCard } from "../../components/trainer/StatsCard ";
import { ClientsOverview } from "../../components/trainer/ClientsOverview";
import { UpcomingAppointments } from "../../components/trainer/UpcomingAppointments";
import { RevenueChart } from "../../components/trainer/RevenueChart";

export const TrainerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const {
    profile,
    clients,
    revenue,
    revenueHistory,
    appointments,
    workouts,
    nutritionPlans,
    loading,
    trainerDashboardStats,
    error,
  } = useSelector((state) => state.trainer);

  useEffect(() => {
    console.log("Running fetchDashboardData...");

    const fetchDashboardData = async () => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));

        const profileResponse = await getProfile();
        const clientResponse = await getClients();
        const appointmentResponse = await getAppointmentForTrainer();
        const revenueRsponse = await getTrainerRevenue();
        const workoutsResponse = await getTrainerWorkouts();
        const nutritionPlansResponse = await getTrainerNutritionPlans();

        console.log("Profile response", profileResponse.data.trainer);
        console.log("Client res", clientResponse.data.clients);
        console.log("appointment response", appointmentResponse);
        console.log("revenue response", revenueRsponse);
        console.log("revenueee :  ",revenueRsponse.data);
        
        console.log("workout response", workoutsResponse.data);
        console.log("nutritionresponse", nutritionPlansResponse.data);

        // Update Redux state with the fetched data
        dispatch(setTrainerProfile(profileResponse.data.trainer));
        dispatch(setClients(clientResponse.data.clients));
        dispatch(setAppointments(appointmentResponse.data.data));

        dispatch(setRevenue(revenueRsponse.data.totalRevenue));
        dispatch(setRevenueHistory(revenueRsponse.data.revenueHistory))


        dispatch(setWorkouts(workoutsResponse.data));
        dispatch(setNutritionPlans(nutritionPlansResponse.data));

        dispatch(
          setTrainerDashboardStats({
            clientCount: clientResponse.data.count || 0,
            appointmentsToday: appointmentResponse.data.count || 0,
            totalRevenue: revenueRsponse.data.totalRevenue || 0,
            totalWorkouts: workoutsResponse.data.count || 0,
            totalNutritionPlans: nutritionPlansResponse.data.count || 0,
          })
        );

        console.log(
          "trainer slice : \n",
          "profile :",
          JSON.stringify(profile, null, 2),

          "\nclients :",
          JSON.stringify(clients, null, 2),

          "\nrevenue :",
          JSON.stringify(revenue, null, 2),

          "\nrevenueHistory :",
          JSON.stringify(revenueHistory, null, 2),

          "\nworkouts :",
          JSON.stringify(workouts, null, 2),
          "\nnutritionplans :",
          JSON.stringify(nutritionPlans, null, 2),
          "\nappointments :",
          JSON.stringify(appointments, null, 2),
          "\nloading :",
          loading,
          "\ntrainerDasboardStats :",
          JSON.stringify(trainerDashboardStats, null, 2)
        );

        // dispatch(set)
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ">
        <StatsCard
          title="Total Clients"
          value={trainerDashboardStats.clientCount}
          icon="users"
          color="bg-blue-500"
        />
        <StatsCard
          title="Today's Appointments"
          value={trainerDashboardStats.appointmentsToday}
          icon="calendar"
          color="bg-green-500"
        />
        <StatsCard
          title=" Workouts"
          value={trainerDashboardStats.totalWorkouts}
          icon="dumbbell"
          color="bg-purple-500"
        />
        <StatsCard
          title="Nutrition Plan"
          value={trainerDashboardStats.totalNutritionPlans} 
          icon="apple-alt" 
          color="bg-green-500" 
        />

        <StatsCard
          title="Total Revenue"
          value={`₹${trainerDashboardStats.totalRevenue.toFixed(2)}`}
          icon="indian-rupee-sign"
          color="bg-amber-500"
        />
      </div>
            
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpcomingAppointments appointments={appointments?.slice(0, 5) || []} />
        <RevenueChart monthlyRevenue= {revenueHistory} />
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Clients Overview</h2>
          
          <ClientsOverview clients={clients} />
        </div>
      </div>
    </>
  );
};
