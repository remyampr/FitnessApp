import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userSignup, userVerify } from '../../services/userServices'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/features/userSlice'

export const UserSignup = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch();
  
 
  const [values,setValues]=useState({
    name:"",
    email:"",
    password:""
  })

  const [otpSent,setOtpSent]=useState(false); //tracking otp sent
  const[otp,setOtp]=useState("");
  const[loading,setLoading]=useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      console.log("Sending request to backend with:", values);
      
      const res=await userSignup(values);
      console.log("res :",res);
      toast.success("SignUp Successful! Check your email for the OTP.");
      setOtpSent(true);
    } catch (err) {
      console.log(err); 
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error); 
    }
    else {
            toast.error("An unexpected error occurred."); // Fallback error message
          }     
    } finally {
      setLoading(false); // Set loading state to false when the request is done
    }
  }

  const onVerifyOtp=()=>{
    setLoading(true);
    userVerify(values.email,otp).then((res=>{
      console.log("res :",res);
      toast.success("Email verified successfully!");
      dispatch(setUser(res.data.user));
      console.log("after dispatch to slice : ",res.data.user);
      if(res.data.user.isProfileComplete){
     
        navigate("/user/dashboard");
}else  navigate("/user/complete-profile");

    })).catch((err)=>{
      console.log(err);
       if (err.response && err.response.data && err.response.data.error) {
         toast.error(err.response.data.error); 
       } else {
         toast.error("An unexpected error occurred."); // Fallback error message
       }
 })
  }



  return (
    <div className="max-w-2xl mx-auto bg-transparent p-7">
  <div className='p-7'>
    
    {/* Name */}
    <div className="relative z-0 mb-6 w-full group">
      <input 
        type="text" 
        name="name" 
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
        placeholder=" " required 
        onChange={(e)=>{setValues({...values,[e.target.name]:e.target.value}) }}
      />
      <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        Name
      </label>
    </div>

    {/* Email */}
    <div className="relative z-0 mb-6 w-full group">
      <input 
        type="email" 
        name="email" 
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
        placeholder=" " required 
        onChange={(e)=>{setValues({...values,[e.target.name]:e.target.value}) }}
      />
      <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        Email
      </label>
    </div>

    {/* Password */}
    <div className="relative z-0 mb-6 w-full group">
      <input 
        type="password" 
        name="password" 
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
        placeholder=" " required 
        onChange={(e)=>{setValues({...values,[e.target.name]:e.target.value}) }}
      />
      <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        Password
      </label>
    </div>

    {/* Forgot Password */}
    <div className="mb-6 text-right">
      <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
        Forgot Password?
      </Link>
    </div>

    {/* Submit Button */}
    {
      !otpSent &&(
        <div className="flex justify-center">
        <button 
          type="submit" 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
          onClick={onSubmit}
          disabled={loading}
        >
         {loading ? 'Sign Up...' : 'Submit'}
        </button>
      </div>
        
      )}
   

{/* otp after register  */}

{otpSent && (
   <div className="mt-6">
   <p className="text-sm text-gray-600 dark:text-gray-400">
     A verification code has been sent to your email.
   </p>
   <div className="relative z-0 mb-6 mt-3 w-full group">
     <input
       type="text"
       name="otp"
       className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
       placeholder=" "
       required
       onChange={(e) => { setOtp(e.target.value) }}
     />
     <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
       OTP
     </label>
   </div>

   <div className="flex justify-center">
     <button
       type="button"
       className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
       onClick={onVerifyOtp}
       disabled={loading}
     >
       {loading ? 'Verifying...' : 'Verify OTP'}
     </button>
   </div>
 </div>
)}




    {/* Sign Up / Login Link */}
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Already registered? 
        <Link to="/user/login" className="text-blue-600 hover:underline ml-1">
          Login here
        </Link>
      </p>
      {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        New User? 
        <Link to="/user/signup" className="text-blue-600 hover:underline ml-1">
          Create an account
        </Link>
      </p> */}
    </div>

  </div>
</div>

  )
}



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../../services/userServices';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileComplete, setUser } from '../../redux/features/userSlice';

export const UserLogin = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch();

  const isProfileComplete=useSelector(state => state.user.isProfileComplete)

const [values,setValues]=useState({

  email:"",
  password:""
})

const onSubmit=(event)=>{
  event.preventDefault();

  if (!values.email || !values.password) {
    // return setError("Please fill in all fields");
    toast.error("Please fill in all fields")
  }
 
  // console.log("values in state : ",values);
  userLogin(values).then((res)=>{
    // console.log("values sending");
    
    
    if (res.data && res.data.user) {
      console.log("login time res got , : ",res);
      
      dispatch(setUser(res.data.user));
      dispatch(setProfileComplete(res.data.user.isProfileComplete));
      console.log("res : ",res);
      toast.success("Login successful!");
    console.log("isProfilecompleted ?: ",isProfileComplete);
     if(res.data.user.isProfileComplete){

            navigate("/user/dashboard");
    }else  navigate("/user/complete-profile");
    } else {
      console.error("Login API response does not contain user data");
      toast.error("Login failed. Please try again.");
    }
    

   
    
  }).catch((err)=>{
    console.log(err);
    if (err.response && err.response.data && err.response.data.error) {
      toast.error(err.response.data.error); // Show error message
    } else {
      toast.error("An unexpected error occurred."); // Fallback error message
    }
  })

}

const handleForgotPassword = () => {
  navigate("/forgot-password", { state: { role: "user" } });
};




  return (
    <div className="max-w-2xl mx-auto bg-transparent p-7">
     <form onSubmit={onSubmit} className="p-7">
      <div className='p-7'>
        {/* Email */}
        <div className="relative z-0 mb-6 w-full group">
          <input type="email" name="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
           onChange={(e)=>{setValues({...values,[e.target.name]:e.target.value}) }} />
          <label htmlFor="floating_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
        </div>

        {/* Password */}
        <div className="relative z-0 mb-6 w-full group">
          <input type="password" name="password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
          onChange={(e)=>{setValues({...values,[e.target.name]:e.target.value}) }}  />
          <label htmlFor="floating_password" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
        </div>

        {/* Forgot Password */}
        <div className="mb-6 text-right">
          <button onClick={handleForgotPassword} className="text-sm text-blue-600 hover:underline"

          >Forgot Password?</button> 
        </div>

        <div className="flex justify-center">
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
           >Submit</button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Not registered? 
            <Link to="/user/signup" className="text-blue-600 hover:underline ml-1">Create an account</Link>
          </p>
        </div>
        </div>
      </form>  
    </div>
  );
};

import React, { useState } from "react";
import { Link } from "react-router-dom";

export const TrainerSignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    certifications: "",
    specialization: "",
    experience: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent p-7">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="relative z-0 w-full group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="name"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
        </div>

        {/* Email */}
        <div className="relative z-0 w-full group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative z-0 w-full group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
        </div>

        {/* Phone */}
        <div className="relative z-0 w-full group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="phone"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone
          </label>
        </div>

        {/* Certifications */}
        <div className="relative z-0 w-full group">
          <input
            type="text"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="certifications"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Certifications
          </label>
        </div>

        {/* Specialization */}
        <div className="relative z-0 w-full group">
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="specialization"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Specialization
          </label>
        </div>

        {/* Experience */}
        <div className="relative z-0 w-full group">
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="experience"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Experience
          </label>
        </div>

        {/* Bio */}
        <div className="relative z-0 w-full group">
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="bio"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Bio
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-auto"
        >
          Submit
        </button>

        <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
          Already registered?{" "}
          <Link to="/trainer/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { trainerLogin } from "../../services/trainerServices";
import { setIsApproved, setTrainer } from "../../redux/features/trainerSlice";

export const TrainerLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, trainer } = useSelector((state) => state.trainer);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!values.email || !values.password) {
      // return setError("Please fill in all fields");
      toast.error("Please fill in all fields");
    }

    try {
      const response = await trainerLogin(values);
      const trainerData = response.data.user;

      console.log("trainer login");
      

      dispatch(setTrainer(trainerData));
      dispatch(setIsApproved(trainerData.isApproved));

      toast.success("Login successful!");

      setTimeout(() => {
        if (trainerData.isApproved) {
          navigate("/trainer/dashboard");
        } else {
          navigate("/trainer/pending-approval");
        }
      }, 100);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    console.log("Updated trainer state in Redux:", {
      isAuthenticated,
      trainer});
  }, [isAuthenticated, trainer]);

  const handleForgotPassword = () => {
    navigate("/forgot-password", { state: { role: "trainer" } });
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent p-7">
      <form onSubmit={onSubmit} className="p-7">
        <div className="p-7">
          {/* Email */}
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="email"
              name="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            <label
              htmlFor="floating_email"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="password"
              name="password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            <label
              htmlFor="floating_password"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-right">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Not registered?
              <Link
                to="/trainer/signup"
                className="text-blue-600 hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};























