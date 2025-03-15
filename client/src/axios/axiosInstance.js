import axios from 'axios';
import { logout } from '../redux/features/userSlice';
import {store} from '../redux/store';

const url=import.meta.env.VITE_BASE_URL;
console.log("Base url : ",url);

 const axiosInstance=axios.create({
    baseURL:url,
    withCredentials:true  //for sending/receiving cookies
})



// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access 
        store.dispatch(logout()); // Clears user data
        window.location.href = '/'; // Redirects after logout
      }
      return Promise.reject(error);
    }
  );



  export default axiosInstance;