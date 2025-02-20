import axios from 'axios';

const url=import.meta.env.VITE_BASE_URL;
console.log("Base url : ",url);

export const axiosInstance=axios.create({
    baseURL:url,
    withCredentials:true
})