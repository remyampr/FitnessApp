import  axiosInstance  from "../axios/axiosInstance";

export const getAllTestimonials=()=>{
    console.log("Sending request to /api/testimonials...");
    console.log("Data type:", typeof data);

    if (data instanceof FormData) {
        console.log("Data is FormData");
        console.log("Content-Type:", "multipart/form-data");
      } else {
        console.log("Data is JSON");
        console.log("Content-Type:", "application/json");
      }

    return axiosInstance.get("/testimonials")
}
export const getAllTrainers=()=>{
    return axiosInstance.get("/trainer/public")
}