import  axiosInstance  from "../axios/axiosInstance";

export const getAllTestimonials=()=>{
    return axiosInstance.get("/testimonials")
}
export const getAllTrainers=()=>{
    return axiosInstance.get("/trainer/public")
}