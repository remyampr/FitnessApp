
import { createSlice } from '@reduxjs/toolkit'

const initialState={
    user:null,
    userId:null,
    //isAuthenticated:false,  //if the user is logged in.
   // isProfileComplete: false,
    selectedTrainer: null,
    loading:false,
    error:null    
};

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload;
            state.user.isAuthenticated=true
            // state.isAuthenticated=true
            // state.userId=user.user._id;
        },
        setProfileComplete:(state,action) => {
            state.user.isProfileComplete=action.payload;
        },
        setSelectedTrainer:(state,action)=>{
            state.selectedTrainer=action.payload;
        },
        clearUser:(state)=>{
            state.user = null;
            state.isAuthenticated = false;
            state.isProfileComplete = false;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
        logout:(state)=>{
            state.user = null;
            state.isAuthenticated = false;
            state.isProfileComplete = false;
        }
    }
})

export const {setUser,clearUser,setLoading,setError,setProfileComplete,setSelectedTrainer,logout}=userSlice.actions;
export default userSlice.reducer;