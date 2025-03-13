import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FaCamera, FaStar, FaStarHalfAlt, FaRegStar, FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { AlertError } from '../../components/shared/AlertError';
import { updateProfile } from '../../services/trainerServices';
import { updateTrainerProfile } from '../../redux/features/trainerSlice';

export const TrainerProfilePage = () => {
  const dispatch = useDispatch();
  const { trainer, loading, error } = useSelector((state) => state.trainer);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');

  console.log("trainer : ",trainer);
  
  
  // Handle image selection
  const handleImageChange =async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a FormData object to send the image to the server
      const formData = new FormData();
      formData.append('image', file);
      
      
      
      const response= await updateProfile(formData);

console.log("response : ",response.data.trainer);

dispatch(updateTrainerProfile(response.data.trainer))

      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Render star ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };
  
  // Format availability for display
  const formatAvailability = (availability) => {
    if (!availability || !availability.length) return "No availability set";
    
    return availability.map((day) => (
      <div key={day.day} className="mb-2">
        <p className="font-medium">{day.day}</p>
        <div className="flex flex-wrap gap-2">
          {day.slots.map((slot, index) => (
            <span 
              key={index} 
              className={`text-xs px-2 py-1 rounded ${slot.isBooked ? 'bg-gray-300' : 'bg-green-100 text-green-800'}`}
            >
              {slot.startTime} - {slot.endTime}
            </span>
          ))}
        </div>
      </div>
    ));
  };
  
  // Render social media links
  const renderSocialLinks = (links) => {
    if (!links || !links.length) return null;
    
    const iconMap = {
      linkedin: <FaLinkedin className="text-blue-700" />,
      instagram: <FaInstagram className="text-pink-600" />,
      facebook: <FaFacebook className="text-blue-600" />,
    };
    
    return (
      <div className="flex gap-4 mt-4">
        {links.map((link, index) => (
          <a 
            key={index} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xl hover:opacity-80 transition-opacity"
          >
            {iconMap[link.platform.toLowerCase()] || link.platform}
          </a>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return <LoadingSpinner/>
  }
  
  if (error) {
    return <AlertError error={error} />
  }
  
  if (!trainer) {
    return <AlertError error={error} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl lg:w-1/3">
          <div className="card-body items-center text-center">
            <div className="relative avatar mb-4">
              <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img 
                  src={imagePreview || trainer.image || "https://via.placeholder.com/150"} 
                  alt={trainer.name} 
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
            
            <h2 className="card-title text-2xl">{trainer.name}</h2>
            <div className="flex items-center gap-1 mb-2">
              {renderRatingStars(trainer.averageRating)}
              <span className="text-sm ml-1">({trainer.reviews.length} reviews)</span>
            </div>
            
            <div className="badge badge-accent mb-3">{trainer.status}</div>
            
            <div className="text-sm mb-2">
              <span className="font-semibold">Email:</span> {trainer.email}
            </div>
            <div className="text-sm mb-2">
              <span className="font-semibold">Phone:</span> {trainer.phone}
            </div>
            <div className="text-sm mb-4">
              <span className="font-semibold">Experience:</span> {trainer.experience} years
            </div>
            
            {trainer.bio && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-sm text-gray-600">{trainer.bio}</p>
              </div>
            )}
            
            {renderSocialLinks(trainer.socialLinks)}
          </div>
        </div>
        
        {/* Details Section */}
        <div className="lg:w-2/3">
          <div className="tabs mb-4">
            <a 
              className={`tab tab-lifted ${activeTab === 'profile' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Details
            </a>
            <a 
              className={`tab tab-lifted ${activeTab === 'reviews' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Client Reviews ({trainer.reviews.length})
            </a>
            <a 
              className={`tab tab-lifted ${activeTab === 'clients' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              Clients ({trainer.clients.length})
            </a>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {activeTab === 'profile' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specialization && trainer.specialization.length > 0 ? (
                        trainer.specialization.map((spec, index) => (
                          <div key={index} className="badge badge-outline">{spec}</div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No specializations listed</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications && trainer.certifications.length > 0 ? (
                        trainer.certifications.map((cert, index) => (
                          <div key={index} className="badge badge-secondary">{cert}</div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No certifications listed</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Availability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trainer.availability ? (
                        formatAvailability(trainer.availability)
                      ) : (
                        <p className="text-sm text-gray-500">No availability set</p>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Client Reviews</h3>
                  {trainer.reviews && trainer.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {trainer.reviews.map((review, index) => (
                        <div key={index} className="card bg-base-200 shadow-sm mb-4">
                          <div className="card-body p-4">
                            <div className="flex items-center gap-1 mb-2">
                              {renderRatingStars(review.rating)}
                              <span className="text-sm ml-2">{review.rating.toFixed(1)} / 5</span>
                            </div>
                            
                            {review.comment && (
                              <p className="text-sm">{review.comment}</p>
                            )}
                            
                            <div className="text-xs text-gray-500 mt-2">
                              {/* If you have client info, you can show it here */}
                              {review.userId && (
                                <span>From client: {
                                  // Try to find client name if populated
                                  typeof review.userId === 'object' && review.userId.name 
                                    ? review.userId.name 
                                    : `Client ID: ${review.userId}`
                                }</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert">
                      <p>You haven't received any reviews yet.</p>
                    </div>
                  )}

                  {/* Information about average rating */}
                  {trainer.reviews && trainer.reviews.length > 0 && (
                    <div className="mt-6 p-4 bg-base-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Rating Summary</h4>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{trainer.averageRating.toFixed(1)}</div>
                        <div className="flex items-center">
                          {renderRatingStars(trainer.averageRating)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ({trainer.reviews.length} {trainer.reviews.length === 1 ? 'review' : 'reviews'})
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'clients' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Clients</h3>
                  {trainer.clients && trainer.clients.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trainer.clients?.map((client, index) => (
                            <tr key={index}>
                              <td>{typeof client === 'object' ? client.name : client}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert">
                      <p>You don't have any clients yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
