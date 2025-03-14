<div className="max-w-2xl mx-auto bg-base-200 p-7">
<form className="p-7" onSubmit={handleProfileSubmit}>
  {/* Phone */}
  <div className="relative z-0 mb-6 w-full group">
    <input
      type="text"
      name="phone"
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      required
      onChange={(e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      }}
    />
    <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      Phone
    </label>
  </div>

  {/* Height */}
  <div className="relative z-0 mb-6 w-full group">
    <input
      type="text"
      name="height"
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      required
      onChange={(e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      }}
    />
    <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      Height (in cm)
    </label>
  </div>

  {/* Weight */}
  <div className="relative z-0 mb-6 w-full group">
    <input
      type="text"
      name="weight"
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      required
      onChange={(e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      }}
    />
    <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      Weight (in kg)
    </label>
  </div>

  {/* Age */}
  <div className="relative z-0 mb-6 w-full group">
    <input
      type="number"
      name="age"
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      required
      onChange={(e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      }}
    />
    <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      Age
    </label>
  </div>

  {/* Gender */}
  <div className="relative z-0 mb-6 w-full group">
    <div className="flex items-center space-x-4">
      <div>
        <input
          type="radio"
          id="male"
          name="gender"
          value="Male"
          checked={formData.gender === "Male"}
          onChange={(e) => {
            setFormData({
              ...formData,
              gender: e.target.value,
            });
          }}
          className="peer hidden"
        />
        <label
          htmlFor="male"
          className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer peer-checked:text-blue-600"
        >
          Male
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="female"
          name="gender"
          value="Female"
          checked={formData.gender === "Female"}
          onChange={(e) => {
            setFormData({
              ...formData,
              gender: e.target.value,
            });
          }}
          className="peer hidden"
        />
        <label
          htmlFor="female"
          className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer peer-checked:text-blue-600"
        >
          Female
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="other"
          name="gender"
          value="Other"
          checked={formData.gender === "Other"}
          onChange={(e) => {
            setFormData({
              ...formData,
              gender: e.target.value,
            });
          }}
          className="peer hidden"
        />
        <label
          htmlFor="other"
          className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer peer-checked:text-blue-600"
        >
          Other
        </label>
      </div>
    </div>
    <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      Gender
    </label>
  </div>

  {/* Fitness Goal */}
  <div className="relative z-0 mb-6 w-full group">
    <label className="text-sm text-gray-500 dark:text-gray-400">
      Fitness Goal
    </label>
    <div className="flex flex-col space-y-2">
      {[
        "Weight Loss",
        "Weight Gain",
        "Muscle Gain",
        "Maintenance",
        "Endurance Improvement",
      ].map((goal) => (
        <label key={goal} className="inline-flex items-center">
          <input
            type="radio"
            name="fitnessGoal"
            value={goal}
            checked={formData.fitnessGoal === goal}
            onChange={(e) => {
              setFormData({
                ...formData,
                fitnessGoal: e.target.value,
              });
            }}
            required
            className="form-radio"
          />
          <span className="ml-2">{goal}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Profile Image (Optional) */}
  <div className="relative z-0 mb-6 w-full group">
    <input
      type="file"
      name="image"
      accept="image/*"
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      onChange={handleImageChange}
    />
    <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      Upload Image (Optional)
    </label>
  </div>

  {/* Submit Button */}
  <div className="flex justify-center">
    <button
      type="submit"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Continue to Trainer Selection
    </button>
  </div>
</form>
</div>
















  //  <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-xl shadow-sm">
  //           <h2 className="text-3xl font-bold mb-6 text-gray-800">
  //             Select a Trainer
  //           </h2>

  //           {trainers.length === 0 ? (
  //             <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-sm">
  //               <FontAwesomeIcon
  //                 icon={faUserTimes}
  //                 className="text-gray-400 text-6xl"
  //               />
  //               <p className="mt-4 text-lg text-gray-600">
  //                 No trainers available at the moment. Please try again later.
  //               </p>
  //             </div>
  //           ) : (
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //               {trainers.map((trainer) => (
  //                 <div
  //                   key={trainer._id}
  //                   className="bg-white border-2 border-gray-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300"
  //                 >
  //                   {trainer.image ? (
  //                     <img
  //                       src={trainer.image}
  //                       alt={trainer.name}
  //                       className="w-full h-52 object-cover"
  //                       onError={(e) => {
  //                         e.target.onerror = null;
  //                         e.target.src =
  //                           "https://via.placeholder.com/400x300/f3f4f6/94a3b8?text=No+Image";
  //                       }}
  //                     />
  //                   ) : (
  //                     <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
  //                       <FontAwesomeIcon
  //                         icon={faUser}
  //                         className="text-gray-400 text-6xl"
  //                       />
  //                     </div>
  //                   )}

  //                   <div className="p-5">
  //                     <h3 className="text-xl font-bold text-gray-800 mb-2">
  //                       {trainer.name}
  //                     </h3>
  //                     <p className="text-gray-600 mb-2">
  //                       {trainer.specialization
  //                         ? trainer.specialization.join(", ")
  //                         : "No specialization available"}
  //                     </p>
  //                     <p className="text-gray-600 mb-2">
  //                       Experience: {trainer.experience} years
  //                     </p>
  //                     <p className="text-gray-600 mb-2">
  //                       Bio: {trainer.bio || "No bio available"}
  //                     </p>
  //                     <p className="text-gray-600 mb-2 flex items-center">
  //                       <FontAwesomeIcon
  //                         icon={faStar}
  //                         className="text-yellow-500 mr-2"
  //                       />
  //                       {trainer.averageRating} / 5
  //                     </p>
  //                     <p className="text-gray-600 mb-4 flex items-center">
  //                       <FontAwesomeIcon
  //                         icon={faCertificate}
  //                         className="text-blue-500 mr-2"
  //                       />
  //                       {trainer.certifications.length > 0
  //                         ? trainer.certifications.join(", ")
  //                         : "No certifications"}
  //                     </p>

  //                     <button
  //                       className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
  //                       onClick={() =>
  //                         setFormData({ ...formData, trainerId: trainer._id })
  //                       }
  //                     >
  //                       Select Trainer
  //                     </button>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           )}

  //           <div className="mt-8 flex justify-end">
  //             <button
  //               onClick={handleTrainerSelect}
  //               disabled={!formData.trainerId}
  //               className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
  //             >
  //               Continue to Payment
  //             </button>
  //           </div>
  //         </div>



  import React, { useState } from 'react'
  import { userForgotPassword, userResetPassword } from '../../services/userServices';
  import { toast } from 'react-toastify';
  import { useLocation, useNavigate } from 'react-router-dom';
  import { trainerForgotPassword, trainerResetPassword } from '../../services/trainerServices';
  
  export const ForgotPassword = () => {
  
    const location = useLocation();
    const role = location.state?.role || "unknown"; 
  
  const [step,setStep]=useState("email");
  // const [email, setEmail] = useState("");
  const [data, setData] = useState({
       email:"",
    role:role
  });
  
  console.log("Role ForgotPassword : ",data.role);
  
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  
  
  const navigate = useNavigate();
  
  const handleSendOTP=async ()=>{
      try {
          console.log("step : ",step);
          
          if(data.role === "user"){
            const response=await userForgotPassword(data);
            console.log("at handle otp data : ",data);
            console.log("at handle otp response : ",response);
          }
          else if(data.role === "trainer"){
            const response=await trainerForgotPassword(data);
            console.log("at handle otp data : ",data);
            console.log("at handle otp response : ",response);
          }
         
          toast.success("otp send");
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
  
        if(data.role === "user"){
          const response=await userResetPassword(data.email,otp,newPassword);
          console.log("at handle resetPassword data : ",data);
          console.log("at handle resetPassword response : ",response);
        }else if(data.role === "trainer"){
          const response=await trainerResetPassword(data.email,otp,newPassword);
          console.log("at handle resetPassword data : ",data);
          console.log("at handle resetPassword response : ",response);
        }
          
          toast.success("password reset ");
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
  
  
  
  
  
  
  
  
  
  
  
  //     
    )
  }
  