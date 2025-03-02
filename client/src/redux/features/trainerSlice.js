import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trainer: {},
  profile: null,
  clients: null,
  revenue: 0,
  revenueHistory: [],
  appointments:null,
  workouts:null,
  nutritionPlans:null,
  isAuthenticated: false,
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
    setRevenue: (state, action) => {
      state.revenue = action.payload;
    },
    setRevenueHistory: (state, action) => {
      state.revenueHistory = action.payload;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setWorkouts: (state, action) => {
      state.workouts = action.payload.totalRevenue;
    },
    setNutritionPlans: (state, action) => {
      state.nutritionPlans = action.payload;
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
  setRevenue,
  setRevenueHistory,
  setAppointments,
  setWorkouts,
  setNutritionPlans,
  setIsApproved,
  setTrainerDashboardStats,
  clearTrainer,
  setLoading,
  setError,
} = trainerSlice.actions;
export default trainerSlice.reducer;
