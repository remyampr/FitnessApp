import React, { useState } from "react";
import { StarIcon } from "lucide-react";
import {  useSelector } from "react-redux";
import { TestimonialModal } from "./TestimonialModal";


 const TestimonialCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const { testimonial, loading } = useSelector((state) => state.user.user.testimonial);
    const { testimonial, loading } = useSelector((state) => state.user ?? { testimonial: null, loading: false });

    const user = useSelector((state) => state.user.user);
    // console.log("in testimonial modal (from redux ) User ",user);
    // console.log("in testimonial modal (from redux ) Testimonial ",testimonial);
    
  
  
    const renderStars = (rating) => {
      return Array.from({ length: 5 }).map((_, index) => (
        <StarIcon 
          key={index} 
          size={18} 
          className={index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        />
      ));
    };
  
    // If user already has a testimonial, show it
    if (testimonial && !loading) {
      return (
        <div className="card bg-base-100 shadow-xl border border-blue-200">
          <div className="card-body">
            <div className="flex justify-between items-center ">
              <h2 className="card-title text-blue-800">Your Testimonial</h2>
              <div className="flex">
                {renderStars(testimonial.rating)}
              </div>
            </div>
            <p className="text-gray-700 italic">{testimonial.message}</p>
            <div className="flex justify-end mt-4">
         
            </div>
          </div>
          
          {isModalOpen && (
            <TestimonialModal 
              onClose={() => setIsModalOpen(false)} 
              existingTestimonial={testimonial}
              isEdit={true}
            />
          )}
        </div>
      );
    }
  
    // If user doesn't have a testimonial yet, show the invitation card
    return (
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="card-body">
          <h2 className="card-title font-bold text-2xl">Share Your Experience</h2>
          <p className="text-blue-100">Your feedback helps us improve our app and inspires others!</p>
          
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn bg-white text-blue-700 hover:bg-blue-100 border-none px-6 py-3 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:shadow-xl"
            >
              <span className="mr-2">✨</span>
              Post a Testimonial
            </button>
          </div>
        </div>
        
        {isModalOpen && (
          <TestimonialModal 
            onClose={() => setIsModalOpen(false)} 
            isEdit={false}
          />
        )}
      </div>
    );
  };

  export default TestimonialCard;

