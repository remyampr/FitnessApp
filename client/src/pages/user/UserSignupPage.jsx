import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userSignup } from '../../services/userServices'
import { toast } from 'react-toastify'

export const UserSignupPage = () => {

  const navigate=useNavigate();
  
  const [values,setValues]=useState({
    name:"",
    email:"",
    password:""
  })

  const onSubmit=()=>{
    userSignup(values).then((res)=>{
      console.log("res :",res);
      toast.success("SignUp Successfully!");
      navigate("/");
      
    }).catch((err)=>{
         console.log(err);
          if (err.response && err.response.data && err.response.data.error) {
            toast.error(err.response.data.error); // Show error message
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
    <div className="flex justify-center">
      <button 
        type="submit" 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>

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
