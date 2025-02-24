
import { createSlice } from '@reduxjs/toolkit'

const initialState={
    trainer:null,
    isAuthenticated:false,
    loading:false,
    error:null    
};

const trainerSlice=createSlice({
    name:"trainer",
    initialState,
    reducers:{
        setTrainer:(state,action)=>{
            state.trainer=action.payload;
            state.isAuthenticated=true
        },
        clearTrainer:(state)=>{
            state.trainer={};
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

export const {setTrainer,clearTrainer,setLoading,setError}=trainerSlice.actions;
export default trainerSlice.reducer;