import  axiosInstance  from "../axios/axiosInstance"

// bascis
export const trainerSignup=(data)=>{
    return axiosInstance.post("/trainer/register",data)
}
export const trainerverify=(email,otp, role = "trainer")=>{
    return axiosInstance.post("/trainer/verify-email",{email,otp, role})
}



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

// trainer Profile
export const getProfile=( )=>{
        return axiosInstance.get("/trainer/profile")
}
export const updateProfile=(data )=>{
        return axiosInstance.put("/trainer/profile/update",data)
}

// client
export const getClients=( )=>{
        return axiosInstance.get("/trainer/clients");
}

// Progress
export const addProgressNotes=( userid,data)=>{
    return axiosInstance.put(`/progress/add-note/${userid}`,data);
}
export const getClientsProgress=( )=>{
    return axiosInstance.get("/progress/trainer/users");
}
export const getClientProgressByid=( userid)=>{
    return axiosInstance.get(`/progress/trainer/${userid}`);
}

// Appointment
export const getAppointmentForTrainer=( )=>{
        return axiosInstance.get("/appointments/trainer");
}
export const updateAppointment=(id,data)=>{
    // console.log("in axios data sending : id,data", id, data);
    
        return axiosInstance.put(`/appointments/trainer/${id}`,data);
}

// Revenue
export const  getTrainerRevenue=( )=>{
    return axiosInstance.get("/trainer/revenue");
}

// Workout
export const  getTrainerWorkouts=( )=>{
    return axiosInstance.get("/workouts/trainer");
}
export const addNewWorkout=(data)=>{
    return axiosInstance.post("/workouts/create",data)
}

// nutrition
export const  getTrainerNutritionPlans=( )=>{
    return axiosInstance.get("/nutrition/trainer");
}
export const addNewNutritionPlan=(data)=>{
    return axiosInstance.post("/nutrition/create",data)
}