import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {loadStripe} from '@stripe/stripe-js';

import {
  faUserTimes,
  faUser,
  faCertificate,
  faStar,
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
} from "../../redux/features/userSlice";

export const CompleteProfile = () => {

  const stripePromise=loadStripe(import.meta.env.VITE_PUBLISHED_KEY_STRIPE)

  const [currentStep, setCurrentStep] = useState(1);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (currentStep === 2) {
      console.log("step select trainer:", currentStep);
      fetchTrainers();
    }
  }, [currentStep]);

  const fetchTrainers = async () => {
    try {
      console.log("Fetching trainers...");
      const response = await getApprovedTrainers();
      console.log("API Response:", response.data);
      console.log("Trainers received from API:", response.data.trainers);
      setTrainers(response.data.trainers || []);
    } catch (err) {
      console.error("Error fetching trainers:", err);
      setTrainers([]);
    }
  };

  // useEffect(() => {
  //   console.log(" useeffect Updated Trainers:", trainers);
  //   console.log("Trainers Reference:", JSON.stringify(trainers));

  // }, [trainers]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("fitnessGoal", formData.fitnessGoal);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      await updateProfile(formDataToSend);
      setCurrentStep(2);
      console.log("Profile updated successfully");

      toast.success("Profile updated, Now select a trainer");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleTrainerSelect = async () => {
    try {
      const res = await assignTrainer({ trainerId: formData.trainerId });
      console.log("response : ", res);

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

  // const handlePayment = async () => {
  //   if (!formData.plan || !formData.duration) {
  //     alert("Please select a subscription plan and duration.");
  //     return;
  //   }
  //   try {
  //     const userId = user?._id;
  //     console.log("userId :", userId);
  //     console.log("TrainerId :", formData.trainerId);

  //     const resOrderData = await createPaymentOrder({
  //       userId,
  //       plan: formData.plan,
  //       trainerId: formData.trainerId,
  //       duration: formData.duration,
  //     });

  //     // payment gateway here
  //     const confirmation = await confirmPayment({
  //       userId,
  //       transactionId: resOrderData.data.transactionId,
  //       paymentStatus: "Success",
  //     });
  //     console.log("orderData ", resOrderData);
  //     console.log("confirmation:", confirmation);

  //     if (
  //       confirmation?.data?.message ===
  //       "Payment successful, subscription activated"
  //     ) {
  //       console.log("Payment successful");
  //       dispatch(setProfileComplete(true));

  //       console.log("Payment successful!!!!!!!!!!!1");
  //       // console.log("Redux isProfileComplete state:", isProfileComplete);
  //       // navigate("/user/dashboard");
  //       toast.success("Payment successful");

  //       console.log("Profile updated! Navigating...");
  //       navigate("/user/dashboard");
  //     } else {
  //       console.error("Unexpected response message:", confirmation?.data);
  //       toast.error("Payment failed");
  //     }
  //   } catch (error) {
  //     console.log("error ", error);

  //     toast.error(" Internal error Payment failed");
  //   }
  // };

  
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
        amount: calculatePrice(),
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
          <div className="max-w-2xl mx-auto bg-transparent p-7">
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
        );
      case 2:
        return (
          <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Select a Trainer
            </h2>

            {trainers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-sm">
                <FontAwesomeIcon
                  icon={faUserTimes}
                  className="text-gray-400 text-6xl"
                />
                <p className="mt-4 text-lg text-gray-600">
                  No trainers available at the moment. Please try again later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((trainer) => (
                  <div
                    key={trainer._id}
                    className="bg-white border-2 border-gray-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300"
                  >
                    {trainer.image ? (
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-full h-52 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/400x300/f3f4f6/94a3b8?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-gray-400 text-6xl"
                        />
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {trainer.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {trainer.specialization
                          ? trainer.specialization.join(", ")
                          : "No specialization available"}
                      </p>
                      <p className="text-gray-600 mb-2">
                        Experience: {trainer.experience} years
                      </p>
                      <p className="text-gray-600 mb-2">
                        Bio: {trainer.bio || "No bio available"}
                      </p>
                      <p className="text-gray-600 mb-2 flex items-center">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-yellow-500 mr-2"
                        />
                        {trainer.averageRating} / 5
                      </p>
                      <p className="text-gray-600 mb-4 flex items-center">
                        <FontAwesomeIcon
                          icon={faCertificate}
                          className="text-blue-500 mr-2"
                        />
                        {trainer.certifications.length > 0
                          ? trainer.certifications.join(", ")
                          : "No certifications"}
                      </p>

                      <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        onClick={() =>
                          setFormData({ ...formData, trainerId: trainer._id })
                        }
                      >
                        Select Trainer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleTrainerSelect}
                disabled={!formData.trainerId}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Continue to Payment
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
