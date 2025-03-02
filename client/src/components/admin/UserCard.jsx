import React, { useState } from 'react';
import { FiUser, FiTarget, FiUserCheck, FiEdit } from 'react-icons/fi';
import { UserModal } from './UserModal';


export const UserCard = ({ user }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
       default:
        return 'bg-blue-100 text-blue-800';
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
              {/* {console.log("users trainer * : ",user.trainerId)
              } */}
              <span className="ml-2">{user.trainerId ?.name || 'Not assigned'}</span>
            </div>
            
            {/* Member Since */}
            <div className="flex items-center">
              <span className="font-medium">Member since:</span>
              <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="card-actions justify-end mt-2">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn btn-sm btn-primary"
            >
              <FiEdit className="mr-1" /> View/Edit
            </button>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        user={user}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

