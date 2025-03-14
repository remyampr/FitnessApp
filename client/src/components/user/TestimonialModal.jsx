import React, { useState } from "react";
import { postMyTestimonial } from "../../services/userServices";
import { useDispatch } from "react-redux";
import { setTestimonial } from "../../redux/features/userSlice";
import { StarIcon } from "lucide-react";

export const TestimonialModal = ({
  onClose,
  existingTestimonial = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: existingTestimonial?.name || "",
    rating: existingTestimonial?.rating || 5,
    message: existingTestimonial?.message || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const setRating = (rating) => {
    setFormData({ ...formData, rating });
    if (errors.rating) {
      setErrors({ ...errors, rating: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.message.trim())
      newErrors.message = "Please share your experience";
    if (formData.message.length < 10)
      newErrors.message = "Message is too short";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Form data :", formData);

    setIsSubmitting(true);
    try {
      const response = await postMyTestimonial(formData);
      console.log("Testimonial response : ", response);
      dispatch(setTestimonial(response.data.testimonial));

      onClose();
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setErrors({ submit: "Failed to submit testimonial. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  backdrop-blur-sm z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md animate-fadeIn shadow-lg">
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-xl font-bold text-blue-800">
            { "Share Your Experience"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
  
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label className="block text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-800`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Rating</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="mr-1 focus:outline-none"
                >
                  <StarIcon 
                    size={24} 
                    className={`${formData.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                      cursor-pointer hover:text-yellow-400 transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Your Experience</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full p-2 border rounded h-32 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'} text-gray-800`}
              placeholder="Share your experience with our app..."
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
  
          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
  
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};
