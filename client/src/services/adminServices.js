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
export const editUser=(data)=>{
    return axiosInstance.patch('admin/user/:userId',data)
}
export const getTrainers=()=>{
    return axiosInstance.get("admin/trainers")
}