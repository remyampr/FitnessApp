import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Edit, Save, X } from "lucide-react";
import { FaCamera } from "react-icons/fa";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { AlertError } from "../../components/shared/AlertError";
import { getUserProfile, updateProfile } from "../../services/userServices";
import { setUser, updateUserProfilePic } from "../../redux/features/userSlice";
import { Link } from "react-router-dom";

export const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  console.log("User : ", user);
  console.log("image in redux : ", user?.image);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        dispatch(setUser(response.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  

  if (loading) return <LoadingSpinner />;

  if (error) return <AlertError error={error} />;

  if (!user)
    return <div className="alert alert-warning">No user profile found</div>;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const response = await updateProfile(formData);

      if (response.data) {
        console.log(
          "image updating in redux : ",
          response.data.userUpdated.image
        );

        dispatch(updateUserProfilePic(response.data.userUpdated.image));
      } else {
        console.error("User data not found in response");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file)
    }
  };


  const triggerFileInput=()=>{
    fileInputRef.current.click();
  }

  // Format join date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          {/* Header */}
          <div className="bg-primary text-primary-content p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Profile</h1>
            </div>
          </div>

          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column - Profile picture */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center gap-4">
         <div className="relative avatar mb-4">
              <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img 
                  src={imagePreview || user.image  || "https://via.placeholder.com/150"} 
                  alt={user.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <button 
                onClick={triggerFileInput} 
                className="btn btn-circle btn-sm btn-primary absolute bottom-0 right-0"
                title="Change profile picture"
              >
                <FaCamera />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            

                  <h2 className="text-xl font-semibold text-center">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 text-center">{user.email}</p>

                  {/* Subscription details */}
                  <div className="card w-full bg-base-200">
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg">Subscription</h3>
                      <div className="divider my-1"></div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="font-medium">Status:</span>
                        <span
                          className={
                            user.subscription?.status === "Active"
                              ? "text-success"
                              : "text-error"
                          }
                        >
                          {user.subscription?.status || "Inactive"}
                        </span>

                        <span className="font-medium">Plan:</span>
                        <span>{user.subscription?.plan || "Free"}</span>

                        {user.subscription?.startDate && (
                          <>
                            <span className="font-medium">Valid from:</span>
                            <span>
                              {formatDate(user.subscription.startDate)}
                            </span>

                            <span className="font-medium">Valid until:</span>
                            <span>{formatDate(user.subscription.endDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card w-full bg-base-200">
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg">Account Info</h3>
                      <div className="divider my-1"></div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="font-medium">Member since:</span>
                        <span>{formatDate(user.joinDate)}</span>

                        <span className="font-medium">Last login:</span>
                        <span>
                          {user.lastLogin ? formatDate(user.lastLogin) : "N/A"}
                        </span>

                        <span className="font-medium">Account status:</span>
                        <span
                          className={
                            user.isActive ? "text-success" : "text-error"
                          }
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - User details */}
              <div className="md:col-span-2">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Personal Information</h3>
                    <div className="divider my-2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">
                            Phone Number
                          </span>
                        </label>
                        <div className="input input-bordered flex items-center h-12">
                          {user.phone || "Not provided"}
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Age</span>
                        </label>
                        <div className="input input-bordered flex items-center h-12">
                          {user.age ? `${user.age} years` : "Not provided"}
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Gender</span>
                        </label>
                        <div className="input input-bordered flex items-center h-12">
                          {user.gender || "Not provided"}
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-medium">
                            Fitness Goal
                          </span>
                        </label>
                        <div className="input input-bordered flex items-center h-12">
                          {user.fitnessGoal || "Not set"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200 mt-6">
                  <div className="card-body">
                    <h3 className="card-title">Measurements</h3>
                    <p className="text-sm text-gray-500">
                      Measurements are updated automatically after workouts
                    </p>
                    <div className="divider my-2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="stat bg-base-100 shadow">
                        <div className="stat-title">Height</div>
                        <div className="stat-value">{user.height || "—"}</div>
                        <div className="stat-desc">cm</div>
                      </div>

                      <div className="stat bg-base-100 shadow">
                        <div className="stat-title">Weight</div>
                        <div className="stat-value">{user.weight || "—"}</div>
                        <div className="stat-desc">kg</div>
                      </div>

                      <div className="stat bg-base-100 shadow">
                        <div className="stat-title">BMI</div>
                        <div className="stat-value">
                          {user.height && user.weight
                            ? (
                                user.weight /
                                ((user.height / 100) * (user.height / 100))
                              ).toFixed(1)
                            : "—"}
                        </div>
                        <div className="stat-desc">kg/m²</div>
                      </div>
                    </div>
                  </div>
                </div>

                {user?.trainerId?.name && (
                  <div className="card bg-base-200 mt-6">
                    <div className="card-body">
                      <h3 className="card-title">Your Trainer</h3>
                      <div className="divider my-2"></div>
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full">
                            <img src={user?.trainerId?.image} alt="Trainer" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">
                            Trainer Name: {user?.trainerId?.name}
                          </p>
                          <p className="text-sm text-gray-500"></p>
                          <Link
                            to={"/user/mytrainer"}
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            View more
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {user.paymentHistory && user.paymentHistory.length > 0 && (
                  <div className="card bg-base-200 mt-6">
                    <div className="card-body">
                      <h3 className="card-title">Recent Payments</h3>
                      <div className="divider my-2"></div>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra table-sm">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Transaction ID</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.paymentHistory
                              .slice(0, 3)
                              .map((payment, index) => (
                                <tr key={index}>
                                  <td>{formatDate(payment.paymentDate)}</td>
                                  <td>{payment.transactionId}</td>
                                  <td>₹{payment.amount}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        payment.paymentStatus === "Success"
                                          ? "badge-success"
                                          : "badge-error"
                                      }`}
                                    >
                                      {payment.paymentStatus}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
