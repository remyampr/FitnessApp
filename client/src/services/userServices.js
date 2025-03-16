import axiosInstance from "../axios/axiosInstance";

export const userLogin = (data) => {
  return axiosInstance.post("/user/login", { ...data, role: "user" });
};
// ***************
export const userForgotPassword = (data) => {
  // console.log("data sending to backend: ",data);

  return axiosInstance.post("/user/forgot-password", data);
};

export const userResetPassword = (email, otp, newPassword, role = "user") => {
  return axiosInstance.post("/user/reset-password", {
    email,
    otp,
    newPassword,
    role,
  });
};

export const userSignup = (data) => {
  console.log("in axios User Signup : ", data);
  if (data instanceof FormData) {
    console.log("Data is FormData");
  } else {
    console.log("Data is NOT FormData");
  }

  const headers = data instanceof FormData 
  ? { "Content-Type": "multipart/form-data" }  // Use multipart/form-data if data is FormData
  : { "Content-Type": "application/json" };    // Use application/json otherwise


  return axiosInstance.post("/user/register", data,{ headers });
};
export const userVerify = (email, otp, role = "user") => {
  return axiosInstance.post("/user/verify-email", { email, otp, role });
};
export const userLogout = () => {
  return axiosInstance.post("/user/logout");
};


export const updateProfile = (formDataToSend) => {
  console.log("in axios update profile sending ",formDataToSend);
  for (let [key, value] of formDataToSend.entries()) {
    console.log(key, value);
  }
  if (formDataToSend instanceof FormData) {
    console.log("Data is FormData");
  } else {
    console.log("Data is NOT FormData");
  }

  return axiosInstance.put("/user/profile/update", formDataToSend, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getApprovedTrainers = () => {
  return axiosInstance.get("/user/trainers/approved");
};
export const assignTrainer = (data) => {
  return axiosInstance.put("/user/trainers/assign", data);
};

export const makePaymentOnStripe = (data) => {
  // console.log("Payment data : ",data);

  return axiosInstance.post("/payment/makepayment", data);
};

export const createPaymentOrder = (data) => {
  return axiosInstance.post("/payment/order", data);
};
export const confirmPayment = (data) => {
  return axiosInstance.post("/payment/confirm", data);
};

export const getUserProfile = () => {
  return axiosInstance.get("/user/profile");
};
// export const getUserProgress=()=>{
//     return axiosInstance.get("/progress/user")
// }
export const getUserWorkouts = () => {
  return axiosInstance.get("/workouts/user");
};
export const getUserNutritionPlans = () => {
  return axiosInstance.get("/nutrition/user");
};

export const getUserNotifications = () => {
  return axiosInstance.get("/notifications/notification");
};

export const checkWorkoutStatus = () => {
  return axiosInstance.get("/progress/check");
};
export const saveProgress = (progressData) => {
  return axiosInstance.post("/progress", progressData);
};
export const getProgressHistory = () => {
  return axiosInstance.get("/progress/history");
};

export const getProgressSummary = () => {
  return axiosInstance.get("/progress/summary");
};

// Appoinments

export const getTrainerAvailability = (trainerId) => {
  // console.log("trainerid type :",typeof(trainerId));
  // console.log("trainerid :",trainerId);

  return axiosInstance.get(`/appointments/trainer-availability/${trainerId}`);
};

export const bookAppointment = (appointmentData) => {
  // console.log("in axios ,Booking Appointmentdata :",appointmentData);

  return axiosInstance.post("/appointments/book", appointmentData);
};

export const getUserAppointments = () => {
  return axiosInstance.get("/appointments/user");
};
export const updateAppointment = () => {
  return axiosInstance.put(`/appointments/user/${id}`);
};
export const cancelAppointment = (id, data) => {
  // console.log("axios cancel detail Id data",id,data);

  return axiosInstance.delete(`/appointments/user/${id}`, { data });
};

// Trainer
export const getMyTrainer = () => {
  console.log("Fetching trainer data...");
  return axiosInstance.get("/user/my-trainer");
};
export const postReview = (data) => {
  // console.log("sending data in axios : ",data);

  return axiosInstance.post("/user/my-trainer/review", data);
};
export const deleteMyReview = () => {
  return axiosInstance.delete("/user/my-trainer/review");
};

export const postMyTestimonial = (data) => {
  return axiosInstance.post("/testimonials/user", data);
};
export const getMyTestimonial = () => {
  return axiosInstance.get("/testimonials/user");
};
