import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {loadStripe} from '@stripe/stripe-js';

import {
  faUserTimes,
  faUser,
  faCertificate,
  faStar,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  assignTrainer,
  getApprovedTrainers,
  makePaymentOnStripe,
  updateProfile,
} from "../../services/userServices";
import {
  setLoading,
  setProfileComplete,
  setSelectedTrainer,
  setUser,
} from "../../redux/features/userSlice";
import stripePromise from "../../Stripe/stripe";

export const CompleteProfile = () => {

  // const stripePromise=loadStripe(import.meta.env.VITE_PUBLISHED_KEY_STRIPE)

  const [currentStep, setCurrentStep] = useState(1);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);


  console.log("inside ProfileComplete page !!!!!");
  


  const [formData, setFormData] = useState({
    phone: "",
    height: "",
    weight: "",
    age: "",
    gender: "",
    fitnessGoal: "",
    image: null,
    trainerId: "",
    plan: "",
    duration: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  // console.log("user!!!!!!",user);
  



  useEffect(() => {
    if (currentStep === 2) {
      // console.log("step select trainer:", currentStep);
      fetchTrainers();
    }
  }, [currentStep]);

  const fetchTrainers = async () => {
    try {
      // console.log("Fetching trainers...");
      const response = await getApprovedTrainers();
      // console.log("API Response:", response.data);
      // console.log("Trainers received from API:", response.data.trainers);
      setTrainers(response.data.trainers || []);
    } catch (err) {
      console.error("Error fetching trainers:", err);
      setTrainers([]);
    }
  };



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleProfileSubmit = async (event) => {
    console.log("Inside Profilesubmit !");
    
    event.preventDefault();
    console.log(import.meta.env.VITE_BASE_URL);


    const formDataToSend = new FormData();
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("height", formData.height);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("fitnessGoal", formData.fitnessGoal);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {

      // console.log("Sending profile update with data:", Object.fromEntries(formDataToSend));

      const profileupdateResponse=await updateProfile(formDataToSend);
      setCurrentStep(2);

      console.log("Profile updated successfully",profileupdateResponse);
      // dispatch(set)

      toast.success("Profile updated, Now select a trainer");
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      toast.error("Failed to update profile");
    }
  };

  const handleTrainerSelect = async () => {
    try {
      const res = await assignTrainer({ trainerId: formData.trainerId });
      console.log("response after trainer select : ", res);

      if (res.data) {
        dispatch(setSelectedTrainer(formData.trainerId));
        console.log("Trainer id set in form data", formData.trainerId);
        setCurrentStep(3); // Move to the next step only on success
      } else {
        toast.error(res.data.message || "Failed to assign trainer");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      toast.error("Failed to assign trainer");
      console.error("Error:", error);
    }
  };

 

  
  const calculatePrice = () => {
    if (!formData.plan || !formData.duration) return 0;

    if (formData.plan === "premium") {
      return formData.duration === "3month" ? 4999 : 8999;
    } else {
      return formData.duration === "3month" ? 1999 : 3599;
    }
  };

  
  const handlePayment = async () => {
    if (!formData.plan || !formData.duration) {
      toast.error("Please select a plan");
    }

    const totalAmount = calculatePrice();
    const trainerRevenue = totalAmount * 0.3; 
    const adminRevenue = totalAmount * 0.7; 


    setLoading(true);
  
    try {


       // Convert duration string to actual dates
       const startDate = new Date();
       const endDate = new Date();
       endDate.setMonth(endDate.getMonth() + (formData.duration === "3month" ? 3 : 6));
        
      //  subscription data
      const subscriptionData = {
        trainerId: formData.trainerId,
        plan: formData.plan,
        amount: totalAmount,
        trainerRevenue,
        adminRevenue,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        duration: formData.duration === "3month" ? 3 : 6
      };

       //  Stripe checkout session
       const response= await makePaymentOnStripe(subscriptionData);

       // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        toast.error(error.message);
      }

      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error(error.response?.data?.message || 'Payment processing failed');
    }finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold  mb-6 text-center">Your Fitness Profile</h2>
          
          <form className="space-y-6" onSubmit={handleProfileSubmit}>
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Phone */}
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium  mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </div>
                
                {/* Age */}
                <div className="relative">
                  <label htmlFor="age" className="block text-sm font-medium  mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="16"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Height */}
                <div className="relative">
                  <label htmlFor="height" className="block text-sm font-medium  mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </div>
                
                {/* Weight */}
                <div className="relative">
                  <label htmlFor="weight" className="block text-sm font-medium  mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium ">Gender</label>
              <div className="flex space-x-6">
                {["Male", "Female", "Other"].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={option.toLowerCase()}
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={option.toLowerCase()} className="ml-2 text-sm ">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Fitness Goal Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium ">Fitness Goal</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Weight Loss",
                  "Weight Gain",
                  "Muscle Gain",
                  "Maintenance",
                  "Endurance Improvement",
                ].map((goal) => (
                  <div key={goal} className="flex items-center">
                    <input
                      type="radio"
                      id={goal.replace(/\s+/g, "-").toLowerCase()}
                      name="fitnessGoal"
                      value={goal}
                      checked={formData.fitnessGoal === goal}
                      onChange={(e) => setFormData({...formData, fitnessGoal: e.target.value})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <label htmlFor={goal.replace(/\s+/g, "-").toLowerCase()} className="ml-2 text-sm ">
                      {goal}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Profile Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium ">Profile Image (Optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-base-950 hover:border-gray-900">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm ">Click to upload</p>
                  </div>
                  <input 
                    type="file" 
                    name="image"
                    accept="image/*"
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Continue to Trainer Selection
              </button>
            </div>
          </form>
        </div>
        );
      case 2:
        return (
          <div className="max-w-5xl mx-auto bg-base-100 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6  border-b pb-4">
            Choose Your Fitness Trainer
          </h2>
        
          {trainers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={faUserTimes}
                  className="text-gray-400 text-4xl"
                />
              </div>
              <p className="text-lg text-gray-600 font-medium">
                No trainers available at the moment
              </p>
              <p className="mt-2 text-gray-500">
                Please check back later or contact support for assistance
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div
                  key={trainer._id}
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    formData.trainerId === trainer._id 
                      ? "ring-2 ring-blue-500 shadow-lg" 
                      : "border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="relative">
                    {trainer.image ? (
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-full h-56 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300/f3f4f6/94a3b8?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-gray-300 text-5xl"
                        />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full flex items-center">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-400 mr-1"
                      />
                      <span className="font-medium">{trainer.averageRating}</span>
                      <span className="text-gray-500 text-sm">/5</span>
                    </div>
                  </div>
        
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {trainer.name}
                      </h3>
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {trainer.experience} yrs
                      </span>
                    </div>
        
                    {trainer.specialization && trainer.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {trainer.specialization.map((spec, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
        
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {trainer.bio || "No bio available"}
                    </p>
        
                    {trainer.certifications && trainer.certifications.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <FontAwesomeIcon
                            icon={faCertificate}
                            className="text-blue-500 mr-2"
                          />
                          <span className="text-sm font-medium">Certifications</span>
                        </div>
                        <div className="pl-6">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {trainer.certifications.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
        
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 focus:outline-none ${
                        formData.trainerId === trainer._id
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                      onClick={() => setFormData({ ...formData, trainerId: trainer._id })}
                    >
                      {formData.trainerId === trainer._id ? "Selected" : "Select Trainer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        
          <div className="mt-12 flex justify-between items-center border-t pt-6">
            <button 
              className="text-gray-600 hover:text-gray-800 flex items-center font-medium"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              Back to Profile
            </button>
            
            <button
              onClick={handleTrainerSelect}
              disabled={!formData.trainerId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center"
            >
              Continue to Payment
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          </div>
        </div>
        );

      case 3:
        return (
          <div className="bg-gray-200 px-2 py-8">
          <div className="container px-6 py-8 mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Complete Your Subscription</h2>
            
            <div className="grid gap-6 mt-8 -mx-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {/* Basic Plan */}
              <div className={`px-6 py-4 bg-white/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-lg transition-all duration-200 ${formData.plan === "basic" ? "ring-4 ring-blue-400" : ""}`}>
                <p className="text-lg font-medium text-gray-800">Basic Plan</p>
                <h4 className="mt-2 text-4xl font-semibold text-gray-800">
                  ₹{formData.duration === "3month" ? "1999" : "3599"}
                  <span className="text-base font-normal text-gray-500"> / {formData.duration === "3month" ? "3 Months" : "6 Months"}</span>
                </h4>
                
                <p className="mt-4 text-gray-600">
                  Essential fitness coaching suitable for beginners.
                </p>
        
                <div className="mt-6">
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-gray-800">Trainer:</span> {trainers.find((t) => t._id === formData.trainerId)?.name || "Not selected"}
                  </p>
                </div>
        
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">2 sessions per week</span>
                  </div>
        
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">Basic workout plans</span>
                  </div>
        
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">Email support</span>
                  </div>
                </div>
        
                <button 
                  className={`w-full px-4 py-2 mt-10 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform ${formData.plan === "basic" ? "bg-blue-600" : "bg-blue-500"} rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
                  onClick={() => setFormData((prev) => ({ ...prev, plan: "basic" }))}
                >
                  {formData.plan === "basic" ? "Selected" : "Choose Basic"}
                </button>
              </div>
        
              {/* Premium Plan */}
              <div className={`px-6 py-4 bg-white/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-lg relative transition-all duration-200 ${formData.plan === "premium" ? "ring-4 ring-blue-400" : ""}`}>
                <div className="absolute top-0 right-0 px-3 py-1 bg-blue-500 text-white text-xs font-bold uppercase rounded-tr-lg rounded-bl-lg">
                  Popular
                </div>
                <p className="text-lg font-medium text-gray-800">Premium Plan</p>
                <h4 className="mt-2 text-4xl font-semibold text-gray-800">
                  ₹{formData.duration === "3month" ? "4999" : "8999"}
                  <span className="text-base font-normal text-gray-500"> / {formData.duration === "3month" ? "3 Months" : "6 Months"}</span>
                </h4>
                
                <p className="mt-4 text-gray-600">
                  Comprehensive fitness coaching for serious results.
                </p>
        
                <div className="mt-6">
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-gray-800">Trainer:</span> {trainers.find((t) => t._id === formData.trainerId)?.name || "Not selected"}
                  </p>
                </div>
        
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">5 sessions per week</span>
                  </div>
        
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">Personalized workout plans</span>
                  </div>
        
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">24/7 chat support</span>
                  </div>
        
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">Nutrition guidance</span>
                  </div>
        
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-500 mr-4">✓</div>
                    <span className="text-gray-600">Progress tracking</span>
                  </div>
                </div>
        
                <button 
                  className={`w-full px-4 py-2 mt-10 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform ${formData.plan === "premium" ? "bg-blue-600" : "bg-blue-500"} rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
                  onClick={() => setFormData((prev) => ({ ...prev, plan: "premium" }))}
                >
                  {formData.plan === "premium" ? "Selected" : "Choose Premium"}
                </button>
              </div>
        
              {/* Duration Selection and Payment Processing */}
              <div className="px-6 py-4 bg-white/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-lg">
                <p className="text-lg font-medium text-gray-800">Subscription Details</p>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Selected Trainer</label>
                    <div className="bg-white/40 rounded-lg p-3 text-gray-700 border border-gray-200">
                      {trainers.find((t) => t._id === formData.trainerId)?.name || "Please select a trainer"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subscription Duration</label>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full bg-white/40 border border-gray-300 text-gray-700 px-4 py-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-colors duration-200"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                      >
                        <option value="" className="text-gray-800">Select Duration</option>
                        <option value="3month" className="text-gray-800">3 Months</option>
                        <option value="6month" className="text-gray-800">6 Months</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <div className="h-4 w-4">▼</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Total Amount</h3>
                    <p className="text-3xl font-bold text-gray-800">
                      ₹{formData.plan === "premium"
                          ? formData.duration === "3month"
                            ? 4999
                            : 8999
                          : formData.duration === "3month"
                          ? 1999
                          : 3599 || "—"}
                    </p>
                  </div>
                </div>
        
                <button
                  className="w-full px-4 py-3 mt-10 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  onClick={handlePayment}
                  disabled={!formData.trainerId || !formData.plan || !formData.duration}
                >
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ul className="steps w-full mb-8">
        <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
          Basic Profile
        </li>
        <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
          Select Trainer
        </li>
        <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
          Payment
        </li>
      </ul>

      {renderStepContent()}
    </div>
  );
};
