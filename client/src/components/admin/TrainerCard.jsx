import React, { useState } from 'react';
import { FiUser, FiStar, FiEdit } from 'react-icons/fi';
import { TrainerModal } from '../admin/TrainerModal';

export const TrainerCard = ({ trainer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log("in TrainerCard : ",trainer);
  

  // Determine the availability status
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl overflow-hidden ">
        <div className="card-body p-4">
          {/* Trainer Header with avatar and basic info */}
          <div className="flex items-center mb-4">
            <div className="avatar mr-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                {trainer.image ? (
                  <img src={trainer.image} alt={trainer.name} />
                ) : (
                  <FiUser className="w-6 h-6 text-gray-500" />
                )}
              </div>
            </div>
            <div>
              <h2 className="card-title font-bold">{trainer.name}</h2>
              <div className="text-sm text-gray-500">{trainer.email}</div>
              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getAvailabilityColor('available')}`}>
                {trainer.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
          </div>

          {/* Trainer details */}
          <div className="space-y-2 text-sm mb-4">
            {/* Bio */}
            <div className="flex items-center">
              <span className="font-medium">Bio:</span>
              <span className="ml-2">{trainer.bio || 'Not provided'}</span>
            </div>

            {/* Experience */}
            <div className="flex items-center">
              <span className="font-medium">Experience:</span>
              <span className="ml-2">{trainer.experience || 'Not specified'} years</span>
            </div>

            {/* Certifications */}
            <div className="flex items-center">
              <span className="font-medium">Certifications:</span>
              <span className="ml-2">{trainer.certifications.length > 0 ? trainer.certifications.join(', ') : 'Not provided'}</span>
            </div>

            {/* Specialization */}
            <div className="flex items-center">
              <span className="font-medium">Specialization:</span>
              <span className="ml-2">{trainer.specialization.length > 0 ? trainer.specialization.join(', ') : 'Not specified'}</span>
            </div>

            {/* Clients */}
            <div className="flex items-center">
              <span className="font-medium">Clients:</span>
              <span className="ml-2">{trainer.clients.length} client{trainer.clients.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Average Rating */}
            <div className="flex items-center">
              <FiStar className="w-4 h-4 mr-2 text-primary" />
              <span className="font-medium">Rating:</span>
              <span className="ml-2">{trainer.averageRating || 'No ratings yet'}</span>
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

      {/* Trainer Modal */}
      <TrainerModal 
        trainer={trainer}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
