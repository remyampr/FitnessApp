import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userSignup, userVerify } from '../../services/userServices'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/features/userSlice'

export const UserSignupPage = () => {

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









