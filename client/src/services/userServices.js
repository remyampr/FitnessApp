import { axiosInstance } from "../axios/axiosInstance";

export const userLogin=(data)=>{
    return axiosInstance.post("/user/login",data)
}

export const userSignup=(data)=>{
    return axiosInstance.post("/user/register",data)
}