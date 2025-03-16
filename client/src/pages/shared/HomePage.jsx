import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDumbbell, FaHeartbeat, FaUsers,FaAppleAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { getAllTestimonials } from "../../services/CommonServices";

export const HomePage = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const getTestimonials = async () => {
      const response = await getAllTestimonials();

      console.log("testimonial response", response.data);

      setTestimonials(response.data);
    };

    getTestimonials();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-4xl backdrop-blur-sm bg-base-900/50 p-10 rounded-xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold text-white mb-6"
          >
            Transform Your Body,
            <br />
            Transform Your Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-200 mb-10"
          >
            "The only bad workout is the one that didn't happen. Take the first
            step towards a healthier you today."
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-x-6"
          >
            <button
              className="btn btn-primary px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform"
              onClick={() => navigate("/user/login")}
            >
              Join as User
            </button>
            <button
              className="btn btn-secondary px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform"
              onClick={() => navigate("/trainer/login")}
            >
              Join as Trainer
            </button>
          </motion.div>
        </div>
      </section>

      {/* App Info Section */}
      <section className="py-20 bg-base-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-4 gap-10">
            <div className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
              <div className="flex justify-center mb-4">
                <FaDumbbell className="text-5xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 ">Custom Workouts</h3>
              <p className="text-gray-300">
                Get personalized workout plans tailored to your specific goals,
                fitness level, and preferences.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
              <div className="flex justify-center mb-4">
                <FaAppleAlt className="text-5xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Customized Nutrition Plans
              </h3>
              <p className="text-gray-300">
                Receive daily nutrition plans personalized for your goals,
                dietary preferences, and activity level, ensuring you fuel your
                body properly.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
              <div className="flex justify-center mb-4">
                <FaHeartbeat className="text-5xl text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Expert Trainers</h3>
              <p className="text-gray-300">
                Connect with certified fitness professionals who will guide you
                every step of the way.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
              <div className="flex justify-center mb-4">
                <FaUsers className="text-5xl text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Supportive Community</h3>
              <p className="text-gray-300">
                Join a community of like-minded individuals who will motivate
                and inspire you on your fitness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-base-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) => (
              <div key={testimonial._id} className="bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial?.user?.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{testimonial.name}</h3>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.message}"</p>
              </div>
            ))}
          </div>
          {/* <div className="text-center mt-12">
            <button
              className="btn btn-outline btn-primary"
              onClick={() => navigate("/testimonials")}
            >
              View More Testimonials
            </button>
          </div> */}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their lives
            with our platform.
          </p>
          <div className="space-x-6">
            <button
              className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={() => navigate("/user/signup")}
            >
              Sign Up Now
            </button>
            {/* <button
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold"
              onClick={() => navigate("/learn-more")}
            >
              Learn More
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
};
