import axios from 'axios';
import { logout } from '../redux/features/userSlice';
import {store} from '../redux/store';

const url=import.meta.env.VITE_BASE_URL;
console.log("Base url : ",url);

 const axiosInstance=axios.create({
    baseURL:url,
    withCredentials:true , //for sending/receiving cookies
    headers: {
      // 'Content-Type': 'application/json'
      "Content-Type": "multipart/form-data",
    }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {

        console.warn("Unauthorized (401) detected, but NOT logging out for debugging.");

        // Handle unauthorized access 
        // store.dispatch(logout()); // Clears user data
        // window.location.href = '/'; // Redirects after logout
      }
      return Promise.reject(error);
    }
  );



  export default axiosInstance;