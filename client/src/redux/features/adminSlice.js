
import { createSlice } from '@reduxjs/toolkit'

const initialState={
    admin:{},
    isAuthenticated:false,
    loading:false,
    error:null    
};

const adminSlice=createSlice({
    name:"admin",
    initialState,
    reducers:{
        setAdmin:(state,action)=>{
            state.admin=action.payload;
            state.isAuthenticated=true
        },
        clearAdmin:(state)=>{
            state.admin={};
            state.isAuthenticated=false;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload;
        }
    }
})

export const {setAdmin,clearAdmin,setLoading,setError}=adminSlice.actions;
export default adminSlice.reducer;