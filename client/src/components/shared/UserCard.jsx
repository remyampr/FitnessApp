import React, { useState } from "react";
import { FiEdit, FiUser, FiTarget, FiUserCheck,FiX,FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { UserModal } from "./UserModal";

export const UserCard = ({ user }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
<>

<div className="card bg-base-100 shadow-xl overflow-hidden">
    <div className="card-body p-4">
      {/* User Header with avatar and basic info */}
      <div className="flex items-center mb-4">
        <div className="avatar mr-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            {user.image ? (
              <img src={user.image} alt={user.name} />
            ) : (
              <FiUser className="w-6 h-6 text-gray-500" />
            )}
          </div>
        </div>
        <div>
          <h2 className="card-title font-bold">{user.name}</h2>
          <div className="text-sm text-gray-500">{user.email}</div>
          <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getStatusColor(user.subscription.status)}`}>
            {user.subscription.status}
          </span>
        </div>
      </div>

      {/* User details */}
      <div className="space-y-2 text-sm mb-4">
        {/* Fitness Goal */}
        <div className="flex items-center">
          <FiTarget className="w-4 h-4 mr-2 text-primary" />
          <span className="font-medium">Fitness Goal:</span>
          <span className="ml-2">{user.fitnessGoal || 'Not set'}</span>
        </div>
        
        {/* Selected Trainer */}
        <div className="flex items-center">
          <FiUserCheck className="w-4 h-4 mr-2 text-primary" />
          <span className="font-medium">Trainer:</span>
          <span className="ml-2">{user.trainerId?.name || 'Not assigned'}</span>
        </div>
        
        {/* Member Since */}
        <div className="flex items-center">
          <span className="font-medium">Member since:</span>
          <span className="ml-2">{new Date(user.joinDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="card-actions justify-end mt-2">
      <button 
              className="btn btn-sm btn-secondary"
              onClick={() => setSelectedUser(user)}
            >
                 <FiEye className="w-4 h-4" /> View More
                     </button>
        
      </div>
    </div>
  </div>

  {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button 
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setIsModalOpen(false)}
            >
              <FiX className="w-4 h-4" /> Close
            </button>
            <h2 className="text-lg font-bold mb-2">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Fitness Goal: {user.fitnessGoal || "Not set"}</p>
            <p>Trainer: {user.trainerId?.name || "Not assigned"}</p>
            <p>Member since: {new Date(user.joinDate).toLocaleDateString()}</p>
            <div className="mt-4 flex justify-end">
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => window.location.href = `/admin/users/${user._id}`}
              >
                <FiEdit className="mr-1" /> Edit
              </button>
            </div>
          </div>
        </div>
      )} */}

{selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

</>



  )
};
