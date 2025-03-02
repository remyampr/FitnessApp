
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
    loading:false,
    error:null ,

};

const adminSlice=createSlice({
    name:"admin",
    initialState,
    reducers:{
        setAdmin:(state,action)=>{
            console.log("Setting admin state:", action.payload);
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
        setTrainers: (state, action) => {
            state.trainers = action.payload;  
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

export const {setAdmin,clearAdmin,setLoading,setError,setDashboardStats,
    setUsers,updateUserInStore,deleteUserFromStore,
    setTrainers}=adminSlice.actions;
export default adminSlice.reducer;