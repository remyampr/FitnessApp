import  axiosInstance  from "../axios/axiosInstance";

export const userLogin=(data)=>{
    return axiosInstance.post("/user/login",data)
}

export const userSignup=(data)=>{
    return axiosInstance.post("/user/register",data)
}
export const userVerify=(email,otp)=>{
    return axiosInstance.post("/user/verify-email",{email,otp})
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
export const getCertifiedTrainers=()=>{
    return axiosInstance.get("/user/trainers/certified")
}
export const assignTrainer=(data)=>{
    return axiosInstance.put("/user/trainers/assign",data)
    // ,{
    //     headers:{
    //         "Content-Type": "application/json",
    //     }
    // }
}

export const createPaymentOrder=(data)=>{
    return axiosInstance.post("/payment/order",data)
}
export const confirmPayment=(data)=>{
    return axiosInstance.post("/payment/confirm",data)
}

