import  axiosInstance  from "../axios/axiosInstance"

export const adminLogin=(data)=>{
    // console.log("api to backend ",data)
    return axiosInstance.post("admin/login",data);
}

export const adminLogout=()=>{
    return axiosInstance.post("admin/logout")
}
export const adminForgotPassword=(data)=>{
    // console.log("data : ",data);
    
    return axiosInstance.post("admin/forgot-password",data)
}

export const adminResetPassword=(email, otp, newPassword , role="admin" )=>{
    return axiosInstance.post("/admin/reset-password",{ email,otp,newPassword,role})
}
export const getAdminDashboard=( )=>{
    return axiosInstance.get("/admin/dashboard")
}
export const getAdminUsers=( )=>{
    return axiosInstance.get("/admin/users")
}
export const updateUser=(userId,data)=>{
    return axiosInstance.patch(`admin/user/${userId}`,data)
}
export const deactivateUser=(userId)=>{
    return axiosInstance.patch(`admin/user/${userId}`)
}
export const getTrainers=()=>{
    return axiosInstance.get("admin/trainers")
}
export const approveTrainers=()=>{
    return axiosInstance.patch("admin/trainers/approve")
}
export const updateTrainer=(trainerId,data)=>{
    return axiosInstance.patch(`admin/trainer/${trainerId}`,data)
}
export const deactivateTrainer=(trainerId)=>{
    return axiosInstance.patch(`admin/user/${trainerId}`)
}
// Appointments
export const  getAllAppointments=()=>{
    return axiosInstance.get("appointments/admin/all")
}
export const  getAppointmentById=(id)=>{
    return axiosInstance.get(`appointments/${id}`)
}
export const  forceUpdateAppointment=(id,updateData)=>{
    return axiosInstance.put(`appointments/override/${id}`,updateData)
}
export const  forceDeleteAppointment=(id)=>{
    return axiosInstance.delete(`appointments/override/${id}`)
}

// Revenue
export const  getRevenueData=(filters)=>{
    return axiosInstance.get("admin/revenue",{ params: filters })
}
export const  getRevenueBreakdown=(filters)=>{
    return axiosInstance.get("admin/revenue/breakdown",{ params: filters })
}
export const  getPayments=(filters)=>{
    return axiosInstance.get("admin/payments",{ params: filters })
}
// Workout
export const  getAllWorkouts=()=>{
    return axiosInstance.get("workouts/all")
}
export const  getWorkoutById=(id)=>{
    return axiosInstance.get(`workouts/workout/${id}`)
}


export const deactivateWorkoutPlan=(id)=>{
    return axiosInstance.patch(`workouts/${id}`)
}

export const createWorkout = (formData) => {
    return axiosInstance.post("workouts/create", formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
          }
    })
  }
  
  export const updateWorkoutPlan = (id, formData) => {
    // console.log("Sending to server:", id, formData);
    
    return axiosInstance.put(`workouts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

//   NutritionPlans
export const  getAllNutritionPlans=()=>{
    return axiosInstance.get("nutrition/all")
}

export const createNutritionPlan = (formData) => {
    return axiosInstance.post("nutrition/create", formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
          }
    })
  }
  
  export const updateNutritionPlan = (id, formData) => {
    // console.log("Sending to server:", id, formData);
    
    return axiosInstance.put(`nutrition/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }





