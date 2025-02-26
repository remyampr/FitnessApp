import React, { useState } from 'react'
import { userForgotPassword, userResetPassword } from '../../services/userServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {

const [step,setStep]=useState("email");
// const [email, setEmail] = useState("");
const [data, setData] = useState({
     email:"",
  role:"user"
});
const [maskedEmail, setMaskedEmail] = useState("");
const [otp, setOtp] = useState("");
const [newPassword, setNewPassword] = useState("");



const navigate = useNavigate();

const handleSendOTP=async ()=>{
    try {
        console.log("step : ",step);
        
        const response=await userForgotPassword(data);
        toast.success(response.data.msg);
        setMaskedEmail(maskEmail(data.email));
        setStep("otp");
        
    } catch (error) {
        console.log(error.response,error);
        toast.error(error.response?.data?.error || "Something went wrong.");
    }
}

const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "***@" + domain;
  };


const handleResetPassword=async () =>{
    try {

        const response=await userResetPassword(data.email,otp,newPassword);
        toast.success(response.data.message);
        navigate(`/${data.role}/login`);
        
    } catch (error) {
        console.log(error.response,error);
        
        toast.error(error.response?.data?.error || "Something went wrong.");
    }
}


  return (
<div className="max-w-2xl mx-auto bg-transparent p-7">
    <div className="p-7">
      {step === "email" ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Forgot Password?</h2>
          <p className="text-sm text-gray-600 mb-4">Enter your email to receive a reset OTP.</p>

          {/* Email */}
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="email"
              name="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={(e)=>{setData({...data,[e.target.name]:e.target.value}) }} />
            
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>

          <button
            type="button"
            onClick={handleSendOTP}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Continue
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
          <p className="text-sm text-gray-600 mb-4">
            We have sent an OTP to your email <strong>{maskedEmail}</strong>.
          </p>

          {/* OTP */}
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="text"
              name="otp"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <label
              htmlFor="otp"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              OTP
            </label>
          </div>

          {/* New Password */}
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="password"
              name="newPassword"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label
              htmlFor="newPassword"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              New Password
            </label>
          </div>

          <button
            type="button"
            onClick={handleResetPassword}
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
</div>











//     <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
//     {step === "email" ? (
//       <div>
//         <h2 className="text-lg font-semibold">Forgot Password?</h2>
  
//         <p className="text-sm text-gray-600">Enter your email to receive a reset OTP.</p>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full mt-3 p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button onClick={handleSendOTP} className="mt-4 w-full bg-blue-600 text-white p-2 rounded">
//           Continue
//         </button>
//       </div>
//     ) : (
//       <>
//         <h2 className="text-lg font-semibold">Reset Password</h2>
//         <p className="text-sm text-gray-600">
//           We have sent an OTP to your email <strong>{maskedEmail}</strong>.
//         </p>
//         <input
//           type="text"
//           placeholder="Enter OTP"
//           className="w-full mt-3 p-2 border rounded"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Enter new password"
//           className="w-full mt-3 p-2 border rounded"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />
//         <button onClick={handleResetPassword} className="mt-4 w-full bg-green-600 text-white p-2 rounded">
//           Reset Password
//         </button>
//       </>
//     )}
//   </div>
  )
}
