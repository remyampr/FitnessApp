import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setTrainer } from "../../redux/features/trainerSlice";

import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaCertificate,
  FaStethoscope,
  FaBriefcase,
  FaBookOpen,
  FaKey,
} from "react-icons/fa";
import { trainerSignup, trainerverify } from "../../services/trainerServices";

export const TrainerSignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    certifications: "",
    specialization: "",
    experience: "",
    bio: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    certifications: "",
    specialization: "",
    experience: "",
    bio: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Validate form on input change
  useEffect(() => {
    validateForm();
  }, [values]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      phone: "",
      certifications: "",
      specialization: "",
      experience: null,
      bio: "",
    };
    let isValid = true;

    // Name validation
    if (values.name.trim() === "") {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (values.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (values.password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (values.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(values.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Certifications validation
    if (values.certifications.trim() === "") {
      newErrors.certifications = "Certifications are required";
      isValid = false;
    }

    // Specialization validation
    if (values.specialization.trim() === "") {
      newErrors.specialization = "Specialization is required";
      isValid = false;
    }

    // Experience validation
    // if (values.experience.trim() === "") {
    //   newErrors.experience = "Experience is required";
    //   isValid = false;
    // }
    if (!values.experience.trim()) {
      newErrors.experience = "Experience is required";
      isValid = false;
    } else if (isNaN(values.experience) || Number(values.experience) < 0) {
      newErrors.experience = "Please enter a valid number";
      isValid = false;
    }


    // Bio validation
    if (values.bio.trim() === "") {
      newErrors.bio = "Bio is required";
      isValid = false;
    } else if (values.bio.length < 50) {
      newErrors.bio = "Bio should be at least 50 characters";
      isValid = false;
    }

    setErrors(newErrors);
    setFormValid(isValid);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    
    validateForm();
    if (!formValid) return;

    setLoading(true);
    try {
      console.log("values sending ",values);
      
      const res = await trainerSignup(values);
      toast.success("Signup successful! Check your email for the OTP.");
      console.log("response ",res);
      
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = () => {
    return otp.trim().length > 0;
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();

    if (!validateOtp()) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await trainerverify(values.email, otp);
      toast.success("Email verified successfully!");
      dispatch(setTrainer(res.data.user));

      if (res.data.user.isApproved) {
        navigate("/trainer/dashboard");
      } else {
        navigate("/trainer/pending-approval");
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[200vh] ">
      <div className="max-w-md w-full bg-base-300/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Trainer Account
        </h2>

        {!otpSent ? (
          <form onSubmit={onSubmit}>
            {/* Name Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.name ? "input-error" : ""
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <span className="text-error text-sm mt-1">{errors.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <span className="text-error text-sm mt-1">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Create a password"
                />
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Phone</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.phone ? "input-error" : ""
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <span className="text-error text-sm mt-1">{errors.phone}</span>
              )}
            </div>

            {/* Certifications Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Certifications</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaCertificate className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="certifications"
                  value={values.certifications}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.certifications ? "input-error" : ""
                  }`}
                  placeholder="Enter your certifications"
                />
              </div>
              {errors.certifications && (
                <span className="text-error text-sm mt-1">
                  {errors.certifications}
                </span>
              )}
            </div>

            {/* Specialization Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Specialization</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaStethoscope className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="specialization"
                  value={values.specialization}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.specialization ? "input-error" : ""
                  }`}
                  placeholder="Enter your specialization"
                />
              </div>
              {errors.specialization && (
                <span className="text-error text-sm mt-1">
                  {errors.specialization}
                </span>
              )}
            </div>

            {/* Experience Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Experience</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBriefcase className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="experience"
                  value={values.experience}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.experience ? "input-error" : ""
                  }`}
                  placeholder="Enter your experience"
                />
              </div>
              {errors.experience && (
                <span className="text-error text-sm mt-1">
                  {errors.experience}
                </span>
              )}
            </div>

            {/* Bio Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Bio</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                  <FaBookOpen className="text-gray-400" />
                </div>
                <textarea
                  name="bio"
                  value={values.bio}
                  onChange={handleChange}
                  className={`textarea textarea-bordered w-full pl-10 min-h-[100px] ${
                    errors.bio ? "textarea-error" : ""
                  }`}
                  placeholder="Tell us about yourself and your training philosophy"
                />
              </div>
              {errors.bio && (
                <span className="text-error text-sm mt-1">{errors.bio}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading || !formValid}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifyOtp}>
            {/* OTP Verification Section */}
            <div className="bg-info/10 p-4 rounded-lg mb-6">
              <p className="text-sm">
                A verification code has been sent to{" "}
                <span className="font-bold">{values.email}</span>
              </p>
            </div>

            {/* OTP Field */}
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text font-medium">Enter OTP</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaKey className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter the 6-digit code"
                  maxLength="6"
                />
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className={`btn btn-success w-full ${loading ? "loading" : ""}`}
              disabled={loading || !otp.trim()}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/trainer/login"
              className="text-primary hover:underline font-medium"
            >
              Login instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
