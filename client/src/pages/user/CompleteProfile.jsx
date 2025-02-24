import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  assignTrainer,
  confirmPayment,
  createPaymentOrder,
  getCertifiedTrainers,
  updateProfile,
} from "../../services/userServices";
import { setProfileComplete, setSelectedTrainer } from "../../redux/features/userSlice";

export const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trainers, setTrainers] = useState([]);

  const [formData, setFormData] = useState({
    phone: "",
    height: "",
    weight: "",
    age: "",
    gender: "",
    fitnessGoal: "",
    image: null,
    trainerId: "",
    plan:"",
    
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
      const response = await getCertifiedTrainers();
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
 
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleTrainerSelect = async () => {
    try {
      const res = await assignTrainer({ trainerId: formData.trainerId });
      console.log("response : ",res);
      
  
      if (res.data) { 
        dispatch(setSelectedTrainer(formData.trainerId));
        console.log("Trainer id set in form data", formData.trainerId);
          setCurrentStep(3);  // Move to the next step only on success
      } else {
        
        toast.error(res.data.message || "Failed to assign trainer");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      toast.error("Failed to assign trainer");
      console.error("Error:", error);
    }
  };
  

  const handlePayment = async () => {
    try {
      const userId=user?._id;
      console.log("userId :", userId);  
      console.log("TrainerId :", formData.trainerId);  
      
      const resOrderData = await createPaymentOrder({
        userId,  
        plan: formData.plan,
        trainerId: formData.trainerId
      });

      // payment gateway here
      const confirmation = await confirmPayment({
        userId,
        transactionId:resOrderData.data.transactionId,
        paymentStatus:"Success"
      }
      );
      console.log("orderData ",resOrderData);
      console.log("confirmation:", confirmation);

      if (confirmation?.data?.message === "Payment successful, subscription activated") {
        console.log("Payment successful");
        dispatch(setProfileComplete(true));
    

        console.log("Payment successful!!!!!!!!!!!1");
        // console.log("Redux isProfileComplete state:", isProfileComplete);
        // navigate("/user/dashboard");
        toast.success("Payment successful");
    
              console.log("Profile updated! Navigating...");
              navigate("/user/dashboard");
         
      } else {
        console.error("Unexpected response message:", confirmation?.data);
        toast.error("Payment failed");
      }

    } catch (error) {
      console.log("error ",error);
      
      toast.error(" Internal error Payment failed");
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
          <div className="max-w-2xl mx-auto bg-transparent p-7">
            <h2>Select a Trainer</h2>
            {trainers.length === 0 ? (
              <p>No trainers available at the moment. Please try again later.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((trainer) => (
                  <div
                    key={trainer._id}
                    className="card p-4 border-2 border-gray-300 rounded-lg shadow-md"
                  >
                    <img
                      src={trainer.image} // assuming each trainer has an image property
                      alt={trainer.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold">{trainer.name}</h3>
                      <p className="text-gray-600">
                        {trainer.specialization} || something {trainer._id}
                      </p>{" "}
                      {/* Assuming specialization field */}
                      <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => {
                          console.log('Select Trainer Button Clicked');
                          setFormData({ ...formData, trainerId: trainer._id });
                        }}
                      >
                        Select Trainer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <button
                onClick={handleTrainerSelect} // Ensure this function is correctly defined
                disabled={!formData.trainerId}  // Disable until a trainer is selected
                className="bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Continue to payment
              </button>
            </div>
          </div>
        );
        
        case 3:
          return(
            <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Complete Payment</h2>
              <div className="p-4">
                <h3 className="font-semibold mb-4">Subscription Details</h3>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="mb-2">
                    Selected Trainer:{" "}
                    {trainers.find((t) => t._id === formData.trainerId)?.name}
                  </p>
                  <p className="mb-2">Subscription Period: 1 Month</p>
                  <p className="text-xl font-bold">Total: $99.99</p>
                </div>
      
                <div className="mt-6 space-y-4">
                  {/* <div>
                    <label className="label">Payment Method</label>
                    <select
                      className="select select-bordered w-full"
                      value={formData.paymentType}
                      onChange={(e) => setFormData((prev) => ({ 
                        ...prev, 
                        paymentType: e.target.value 
                      }))}
        
                    >
                       <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
                    </select>
                  </div> */}
      
                  <div>
                    <label className="label">Subscription Plan</label>
                    <select 
                      className="select select-bordered w-full"
                      value={formData.plan}
                      onChange={(e) => setFormData((prev) => ({ 
                        ...prev, 
                        plan: e.target.value 
                      }))}
                    >
                      <option value="">Select Plan</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
      
                <button
                  className="btn btn-primary w-full mt-6"
                  onClick={handlePayment}
                >
                  Process Payment
                </button>
              </div>
            </div>
          </div>
          );


      // case 3:
      //   return (
      //     <div className="card bg-base-100 shadow-xl">
      //       <div className="card-body">
      //         <h2 className="card-title">Complete Payment</h2>
      //         <div className="p-4">
      //           <h3 className="font-semibold mb-4">Subscription Details</h3>
      //           <div className="bg-base-200 p-4 rounded-lg">
      //             <p className="mb-2">
      //               Selected Trainer:{" "}
      //               {trainers.find((t) => t._id === formData.trainerId)?.name}
      //             </p>
      //             <p className="mb-4">Subscription Period: 1 Month</p>
      //             <p className="text-xl font-bold">Total: $99.99</p>
      //           </div>

      //           {/* Add your payment form here */}
      //           <button
      //             className="btn btn-primary w-full mt-6"
      //             onClick={handlePayment}
      //           >
      //             Process Payment
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //   );


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
