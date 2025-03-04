import  axiosInstance  from "../axios/axiosInstance";

export const userLogin=(data)=>{
    return axiosInstance.post("/user/login",{ ...data, role: "user" })
}
// ***************
export const userForgotPassword=(data )=>{
    console.log("data sending to backend: ",data);
    
    return axiosInstance.post("/user/forgot-password",data)
}

export const userResetPassword=(email, otp, newPassword , role="user" )=>{
    return axiosInstance.post("/user/reset-password",{ email,otp,newPassword,role})
}



export const userSignup=(data)=>{
    console.log("in axios User Signup : ",data);
    
    return axiosInstance.post("/user/register",data)
}
export const userVerify=(email,otp, role = "user")=>{
    return axiosInstance.post("/user/verify-email",{email,otp, role})
}
export const userLogout=()=>{
    return axiosInstance.post("/user/logout")
}

export const updateProfile =(formDataToSend)=>{
    return axiosInstance.put("/user/profile/update",formDataToSend),{
        headers:{
            "Content-Type": "multipart/form-data",
        }
    }
    
}
export const getApprovedTrainers=()=>{
    return axiosInstance.get("/user/trainers/approved")
}
export const assignTrainer=(data)=>{
    return axiosInstance.put("/user/trainers/assign",data)
    // ,{
    //     headers:{
    //         "Content-Type": "application/json",
    //     }
    // }
}

export const makePaymentOnStripe=(data)=>{
    return axiosInstance.post("/payment/makepayment",data)

}

export const createPaymentOrder=(data)=>{
    return axiosInstance.post("/payment/order",data)
}
export const confirmPayment=(data)=>{
    return axiosInstance.post("/payment/confirm",data)
}

