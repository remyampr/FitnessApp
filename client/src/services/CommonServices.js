import  axiosInstance  from "../axios/axiosInstance";

export const getAllTestimonials=()=>{
    console.log("Sending request to /api/testimonials...");
 

 

    return axiosInstance.get("/testimonials")
}
export const getAllTrainers=()=>{
    return axiosInstance.get("/trainer/public")
}