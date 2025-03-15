import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaUserCircle, FaDumbbell, FaSpinner } from "react-icons/fa";
import { getAllTrainers } from "../../services/CommonServices";
import { AlertError } from "../../components/shared/AlertError";

export const TrainersListingPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await getAllTrainers();
        setTrainers(response.data.trainers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to load trainers. Please try again later.");
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleViewProfile = (trainerId) => {
    navigate(`/user/login`, {
      state: { redirectTo: `/trainers/${trainerId}` },
    });
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Meet Our Professional Trainers
          </h1>
          <p className="text-lg  max-w-3xl mx-auto">
            Browse our selection of certified fitness experts ready to help you
            transform your body and reach your fitness goals. Sign up today to
            connect with these professionals.
          </p>
        </div>

        {/* Error message */}
        {error && <AlertError error={error} />}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        ) : (
          <>
            {/* Trainers grid */}
            {trainers?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers?.map((trainer) => (
                  <div
                    key={trainer._id}
                    className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <figure className="px-6 pt-6">
                      {trainer.image ? (
                        <img
                          src={trainer.image}
                          alt={trainer.name}
                          className="rounded-xl h-64 w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Trainer";
                            loading = "lazy";
                          }}
                        />
                      ) : (
                        <div className="rounded-xl h-64 w-full flex items-center justify-center bg-gray-700">
                          <FaUserCircle className="text-gray-400 text-6xl" />
                        </div>
                      )}
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{trainer.name}</h2>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                i < Math.round(trainer.averageRating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm">
                          ({trainer.reviews?.length || 0} reviews)
                        </span>
                      </div>
                      <div className="border border-primary p-1 rounded-lg w-full overflow-hidden">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(trainer.certifications || []).map((cert, index) => (
                            <span
                              key={index}
                              className="  text-primary px-2 py-1"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm line-clamp-3">
                        {trainer.bio ||
                          "Professional fitness trainer ready to help you reach your goals."}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <FaDumbbell className="mr-2 text-primary" />
                          <span>
                            {trainer.experience || "N/A"} years experience
                          </span>
                        </div>
                      </div>
                      <div className="card-actions justify-end mt-4">
                        <button
                          className="btn btn-primary w-full"
                          onClick={() => handleViewProfile(trainer._id)}
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-2xl font-bold mb-2">No trainers found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-16 bg-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to start your fitness journey?
          </h2>
          <p className="mb-6">
            Sign up today to access our full range of trainers and personalized
            workout plans.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/user/signup")}
            >
              Sign Up Now
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/user/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
