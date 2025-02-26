import React from 'react'
import { FiX, FiUser, FiTarget, FiUserCheck, FiMail, FiEdit } from "react-icons/fi";

export const UserModal = ({ user, onClose, onEdit }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full md:max-w-2xl relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
        >
          <FiX />
        </button>

        {/* User Details */}
        <div className="flex flex-col items-center text-gray-800 text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            {user.image ? (
              <img src={user.image} alt={user.name} className="rounded-full w-full h-full" />
            ) : (
              <FiUser className="text-gray-500 text-4xl" />
            )}
          </div>

          {/* Name & Email */}
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500 flex items-center justify-center mb-2">
            <FiMail className="mr-2" /> {user.email}
          </p>

          {/* Status Badge */}
          <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
            user.subscription.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}>
            {user.subscription.status}
          </span>

          {/* Extra Details */}
          <div className="mt-4 w-full text-center">
            <p className="text-gray-700 flex justify-center items-center">
              <FiTarget className="mr-2 text-blue-500" /> Fitness Goal: {user.fitnessGoal || "Not set"}
            </p>
            <p className="text-gray-700 flex justify-center items-center">
              <FiUserCheck className="mr-2 text-green-500" /> Trainer: {user.trainerId?.name || "Not assigned"}
            </p>
            <p className="text-gray-700">Member since: {new Date(user.joinDate).toLocaleDateString()}</p>
            <p className="text-gray-700">Age: {user.age}</p>
            <p className="text-gray-700">Height: {user.height} cm</p>
            <p className="text-gray-700">Weight: {user.weight} kg</p>
            <p className="text-gray-700">
              Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
            </p>
            <p className="text-gray-700">
              Profile Status: {user.isProfileComplete ? "Complete" : "Incomplete"}
            </p>
            <p className="text-gray-700">
              Account Verified: {user.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>

          {/* Edit Button */}
          <button 
            onClick={onEdit} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600"
          >
            <FiEdit className="mr-2" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};
