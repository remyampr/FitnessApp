import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trainer: {},
  profile: null,
  clients:[],
  selectedClient: null,
  revenue: 0,
  revenueHistory: [],
  appointments:[],
  workouts:null,
  nutritionPlans:null,
  isAuthenticated: false,
  isActive:true,
  loading: false,
  error: null,
  trainerDashboardStats: {
    clientCount: 0,
    appointmentsToday: 0,
    totalRevenue: 0,
    totalWorkouts:0,
    totalNutritionPlans:0,
  },
};

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    setTrainer: (state, action) => {
      console.log("Dispatched trainer data:", action.payload);
      state.trainer = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      console.log("inslice setTrainer reducer trainer data:", state.trainer);
    },
    setIsApproved: (state, action) => {
      if (state.trainer) {
        state.trainer.isApproved = action.payload;
      }
    },
    setTrainerProfile: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setSelectedClient:(state, action) => {
      state.selectedClient = action.payload;
      // state.selectedClient = action.payload.client;
    },
    resetSelectedClient: (state) => {
      state.selectedClient = null;
    },
    setRevenue: (state, action) => {
      state.revenue = action.payload;
    },
    setRevenueHistory: (state, action) => {
      state.revenueHistory = action.payload;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    updateAppointments: (state, action) => {
      console.log("inside reducer : updating appointmnet details  action.payload ",action.payload);
      
      state.appointments = state.appointments.map((appointment) =>
        appointment._id === action.payload._id ? { ...appointment, ...action.payload } : appointment
      );
    },
    setWorkouts: (state, action) => {
      state.workouts = action.payload; 
    },
    addWorkout: (state, action) => {
      state.workouts = {
        ...state.workouts, 
        count: state.workouts.count + 1, 
        data: [...state.workouts.data, action.payload], // Append new workout
      };
    },
    setNutritionPlans: (state, action) => {
      state.nutritionPlans = action.payload;
    },
    addNutrition:(state,action)=>{
      state.nutritionPlans={
        ...state.nutritionPlans,
        count:state.nutritionPlans.count+1,
        data:[...state.nutritionPlans.data, action.payload]
      }
    },


    setTrainerDashboardStats: (state, action) => {
      state.trainerDashboardStats = action.payload;
    },
    clearTrainer: (state) => {
      state.trainer = {};
      state.isAuthenticated = false;
      state.profile = null;
      state.clients = null;
      state.revenue = null;
      state.appointments = null;
      state.workouts=null,
      state.nutritionPlans=null,
      state.trainerDashboardStats = {
        clientCount: 0,
        appointmentsToday: 0,
        totalRevenue: 0,
        activeWorkouts: 0,
      };
      localStorage.removeItem("trainerState");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setTrainer,
  setTrainerProfile,

  setClients,
  setSelectedClient,
  resetSelectedClient,

  setRevenue,
  setRevenueHistory,

  setAppointments,
  updateAppointments,

  setWorkouts,
  addWorkout,

  setNutritionPlans,
  addNutrition,
  
  setIsApproved,
  setTrainerDashboardStats,
  clearTrainer,
  setLoading,
  setError,
} = trainerSlice.actions;
export default trainerSlice.reducer;
