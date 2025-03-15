
import { createSlice } from '@reduxjs/toolkit'

const initialState={
    // admin:null,
    admin: JSON.parse(localStorage.getItem('persist:root'))?.admin || {},
    dashboardStats: {
        totalUsers: 0,
        activeUsers: 0,
        totalTrainers: 0,
        pendingApprovals: 0,
        totalRevenue: 0,
        totalAppointments: 0,
        upcomingAppointments: 0,
        totalWorkouts: 0,
        totalNutritionPlans: 0,
        recentActivity: { 
            last30DaysRevenue: [],
            lastUsers: [],
            lastTrainers: [],
            recentPayments: [],
            lastAppointments: [],
            lastWorkouts: [],
            lastNutritionPlans: []
        }
    },
    users: [], 
    trainers:[],
    appointments: [],
    currentAppointment: null,
    totalRevenue: 0,
    adminRevenue: 0,
    trainerRevenue: 0,
    payments: [],
    breakdown: {
        monthlyRevenue: [],
        topTrainers: [],
        planDistribution: []
      },
    workouts: [],
    nutritionPlans:[],
    loading:false,
    error:null ,

};

const adminSlice=createSlice({
    name:"admin",
    initialState,
    reducers:{
        setAdmin:(state,action)=>{
            // console.log("Setting admin state:", action.payload);
            state.admin=action.payload;
            state.admin.isAuthenticated=true;
        },
        setDashboardStats: (state, action) => {
            state.dashboardStats = {
                ...state.dashboardStats,   
                ...action.payload,       
                recentActivity: {
                    ...state.dashboardStats.recentActivity,
                    ...action.payload.recentActivity,       
                }
            };
        },
        // users
        setUsers: (state, action) => {
            state.users = action.payload;  
        },
        updateUserInStore:(state,action)=>{
            state.users=state.users.map((user)=>
            user._id === action.payload._id ? action.payload :user )
        },
        deleteUserFromStore: (state, action) => {
            state.users = state.users.filter((user) => user._id !== action.payload);
          },
        //   trainers
        setTrainers: (state, action) => {
            state.trainers = action.payload;  
        },
        updateTrainerInStore:(state,action)=>{
            state.trainers=state.trainers.map((trainer)=>
            trainer._id === action.payload._id ? action.payload :trainer )
        },
        deleteTrainerFromStore: (state, action) => {
            state.trainers = state.trainers.filter((trainer) => trainer._id !== action.payload);
          },
        //   Appointments
          setAppointments: (state, action) => {
            state.appointments = action.payload;
        },
        setCurrentAppointment: (state, action) => {
            state.currentAppointment = action.payload;
        },
        updateAppointmentInStore: (state, action) => {
            state.appointments = state.appointments.map((appointment) => 
                appointment._id === action.payload._id ? action.payload : appointment
            );
        },
        deleteAppointmentFromStore: (state, action) => {
            state.appointments = state.appointments.filter(
                (appointment) => appointment._id !== action.payload
            );
        },
        // revenue
        setTotalRevenue: (state, action) => {
            state.totalRevenue = action.payload;
          },
          setAdminRevenue: (state, action) => {
            state.adminRevenue = action.payload;
          },
          setTrainerRevenue: (state, action) => {
            state.trainerRevenue = action.payload;
          },
          setPayments: (state, action) => {
            state.payments = action.payload;
          },
          setRevenueBreakdown: (state, action) => {
            state.breakdown = action.payload;
          },
        //   Workout
        setWorkouts: (state, action) => {
            state.workouts = action.payload;
          },
          addWorkout: (state, action) => {
            state.workouts.push(action.payload);
          },
          updateWorkout: (state, action) => {
            const index = state.workouts.findIndex(w => w._id === action.payload._id);
            if (index !== -1) {
              state.workouts[index] = action.payload;
            }
          },
          removeWorkout: (state, action) => {
            state.workouts = state.workouts.filter(w => w._id !== action.payload);
          },

          // nutrition
          setNutritionPlans: (state,action)=>{
            state.nutritionPlans=action.payload
          },
          addNutritionPlans: (state, action) => {
            state.nutritionPlans.push(action.payload);
          },




        
        clearAdmin:(state)=>{
            state.admin=null;
            // state.admin.isAuthenticated=false;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload;
        }
    }
})

export const {setAdmin,clearAdmin,setDashboardStats,

    setLoading,setError,

    setUsers,updateUserInStore,deleteUserFromStore,
    setTrainers, updateTrainerInStore,deleteTrainerFromStore,

    setAppointments,setCurrentAppointment,updateAppointmentInStore,deleteAppointmentFromStore,

    setTotalRevenue,setAdminRevenue,setTrainerRevenue,
    setPayments,setRevenueBreakdown,

    setWorkouts,addWorkout,updateWorkout,removeWorkout,

    setNutritionPlans,addNutritionPlans
   
    }=adminSlice.actions;
export default adminSlice.reducer;