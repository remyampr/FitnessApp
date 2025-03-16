
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { deleteMyReview, getMyTrainer, postReview } from '../../services/userServices';
import { setTrainerInfo } from '../../redux/features/userSlice';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { AlertError } from '../../components/shared/AlertError';


export const UserTrainerPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.user);
  const trainer = useSelector((state) => state.user.trainerInfo || {});

//   console.log("user : ",user);
  
  
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // If trainer info is not in redux, fetch it
    if (!trainer._id && user._id) {
      fetchTrainerData();
      console.log("trainerInfo in redux : ",trainer);
      
    }
    
    // Check if user has already reviewed this trainer
    if (trainer.reviews && user._id) {
      const existingReview = trainer?.reviews.find(
        review => review.userId._id === user._id
      );
      
      if (existingReview) {
        setUserReview({
          rating: existingReview.rating,
          comment: existingReview.comment
        });
        setReviewSubmitted(true);
      }
    }
  }, [trainer, user]);
  
  const fetchTrainerData = async () => {
    setLoading(true);
    try {

      const response = await getMyTrainer();
      console.log("getMyTrainer Response : ",response.data.trainer);

      if(response.data){
        dispatch(setTrainerInfo(response.data.trainer));
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load trainer information');
      console.error(err);
      setLoading(false);
    }
  };
  
  const handleRatingChange = (newRating) => {
    setUserReview({
      ...userReview,
      rating: newRating
    });
  };
  
  const handleCommentChange = (e) => {
    setUserReview({
      ...userReview,
      comment: e.target.value
    });
  };
  
  const handleSubmitReview = async (e) => {
  
    e.preventDefault();
    setLoading(true);

    // console.log("inside submit function ");
    // console.log("userReview send to backend : ",userReview);
    try {
      const response = await postReview(userReview);

      // console.log("userReview send to backend : ",userReview);
      

      // console.log("postReview Response : ",response);
      
      
      // Update trainer info in redux
    dispatch(setTrainerInfo(response.data.trainer));
      
      setReviewSubmitted(true);
      setLoading(false);
      
    } catch (err) {
      setError('Failed to submit review');
      console.error(err);
      setLoading(false);
    }
  };
  
  const handleDeleteReview = async () => {
    setLoading(true);
    try {
      const response = await deleteMyReview();

      // console.log("deleteMyReview Response : ",response);

      dispatch(setTrainerInfo(response.data.trainer));
      
      setUserReview({
        rating: 5,
        comment: ''
      });
      setReviewSubmitted(false);
      setLoading(false);
      
    } catch (err) {
      setError('Failed to delete review');
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return    <LoadingSpinner/>
  }

  if (!trainer || !trainer._id) {
    return  <AlertError error={"No trainer information available."} />
    }
  
  const StarRating = ({ rating, onChange, interactive = false }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            onClick={() => interactive && onChange(star)}
            className={interactive ? "cursor-pointer" : ""}
          >
            {star <= rating ? (
              <FaStar className="text-yellow-500 text-xl" />
            ) : (
              <FaRegStar className="text-yellow-500 text-xl" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
       
      {error && (
       <AlertError error={error} />
      )}

      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/3">
          <img 
            src={trainer.image || "/user.png"} 
            alt={trainer.name}
            className="h-full w-full object-cover"
          />
        </figure>
        <div className="card-body lg:w-2/3">
          <h2 className="card-title text-3xl">{trainer.name}</h2>
          <div className="flex items-center mt-2">
            <StarRating rating={trainer.averageRating} />
            <span className="ml-2 text-gray-600">
              ({trainer.averageRating.toFixed(1)}) · {trainer.reviews?.length || 0} reviews
            </span>
          </div>
          
          <div className="divider"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Specialization</h3>
              <p>{trainer.specialization || "General Fitness"}</p>
            </div>
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Experience</h3>
              <p>{trainer.yearsOfExperience || 0} years</p>
            </div>
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p>{trainer.location || "Not specified"}</p>
            </div>
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Contact</h3>
              <p>{trainer.email || "Not available"}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">About</h3>
            <p>{trainer.bio || "No information available"}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Reviews</h3>
        
        {user._id && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h4 className="card-title">
                {reviewSubmitted ? "Your Review" : "Add Your Review"}
              </h4>
              
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block mb-2">Rating</label>
                  <StarRating 
                    rating={userReview.rating} 
                    onChange={handleRatingChange}
                    interactive={!reviewSubmitted}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Comment</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Share your experience with this trainer..."
                    value={userReview.comment}
                    onChange={handleCommentChange}
                    disabled={reviewSubmitted}
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="card-actions justify-end">
                  {reviewSubmitted ? (
                    <button 
                      type="button"
                      onClick={handleDeleteReview}
                      className="btn btn-error"
                      disabled={loading}
                    >
                      {loading ? <span className="loading loading-spinner"></span> : "Delete Review"}
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? <span className="loading loading-spinner"></span> : "Submit Review"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
        
        {trainer.reviews && trainer.reviews.length > 0 ? (
          <div className="space-y-4">
            {trainer.reviews
              .filter(review => !user?._id || review.userId?._id !== user?._id)
              .map((review, index) => (
                <div key={index} className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex items-start">
                      <div className="avatar mr-4">
                        <div className="w-12 h-12 rounded-full">
                          <img 
                            src={user?.image || "/user.png"} 
                            alt={review?.userId?.name} 
                          />
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold">{review?.userId?.name}</h5>
                        <div className="flex items-center mt-1">
                          <StarRating rating={review?.rating} />
                        </div>
                        <p className="mt-2">{review?.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>No reviews yet. Be the first to review this trainer!</span>
          </div>
        )}
      </div>
    </div>
  );
};
