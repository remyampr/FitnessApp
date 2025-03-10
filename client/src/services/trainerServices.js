import  axiosInstance  from "../axios/axiosInstance"

export const trainerLogin=(data)=>{
    return axiosInstance.post("/trainer/login",{ ...data, role: "trainer" })
}

export const trainerForgotPassword=(data )=>{
    // console.log("at trainer services axios: Data :",data);
    
    return axiosInstance.post("/trainer/forgot-password",data)
}

export const trainerResetPassword=(email, otp, newPassword , role="trainer" )=>{
    // console.log("at trainer services axios: Role ",role);
    return axiosInstance.post("/trainer/reset-password",{ email,otp,newPassword,role})
}
export const trainerLogout=( )=>{
    return axiosInstance.post("/trainer/logout")
}
export const getProfile=( )=>{
        return axiosInstance.get("/trainer/profile")
}
export const getClients=( )=>{
        return axiosInstance.get("/trainer/clients");
}


export const getAppointmentForTrainer=( )=>{
        return axiosInstance.get("/appointments/trainer");
}
export const updateAppointment=( )=>{
        return axiosInstance.put("/appointments/trainer/:id");
}


export const  getTrainerRevenue=( )=>{
    return axiosInstance.get("/trainer/revenue");
}
export const  getTrainerWorkouts=( )=>{
    return axiosInstance.get("/workouts/trainer");
}
export const  getTrainerNutritionPlans=( )=>{
    return axiosInstance.get("/nutrition/trainer");
}