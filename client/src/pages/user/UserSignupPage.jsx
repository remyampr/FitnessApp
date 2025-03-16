import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userSignup, userVerify } from '../../services/userServices';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/userSlice';
import { FaEnvelope, FaLock, FaUser, FaKey } from 'react-icons/fa';

export const UserSignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
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
    const newErrors = { name: "", email: "", password: "" };
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

    setErrors(newErrors);
    setFormValid(isValid);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    validateForm();
    if (!formValid) return;
    
    setLoading(true);
    try {
      const res = await userSignup(values);
      toast.success("Signup successful! Check your email for the OTP.");
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error,{
          onClose: () => navigate("/user/login"),
        })
       
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
      const res = await userVerify(values.email, otp);
      toast.success("Email verified successfully!!!!");
      dispatch(setUser(res.data.user));

      // if (res.data.token) {
      //   localStorage.setItem('token', res.data.token);
      //   console.log("From localStorage", localStorage.getItem('token'));
      //   setAuthToken(res.data.token);
      // }
    
      
      
      if (res.data.user.isProfileComplete) {
        navigate("/user/dashboard");
      } else {
        navigate("/user/complete-profile");
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
        // navigate("/user/login")
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[110vh]">
   
      <div className="max-w-md w-full bg-base-300 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
        
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
                  className={`input input-bordered w-full pl-10 ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <span className="text-error text-sm mt-1">{errors.name}</span>}
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
                  className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <span className="text-error text-sm mt-1">{errors.email}</span>}
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
                  className={`input input-bordered w-full pl-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a password"
                />
              </div>
              {errors.password && <span className="text-error text-sm mt-1">{errors.password}</span>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading || !formValid}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifyOtp}>
            {/* OTP Verification Section */}
            <div className="bg-info/10 p-4 rounded-lg mb-6">
              <p className="text-sm">
                A verification code has been sent to <span className="font-bold">{values.email}</span>
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
              className={`btn btn-success w-full ${loading ? 'loading' : ''}`}
              disabled={loading || !otp.trim()}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP option */}
            {/* <div className="mt-4 text-center">
              <button 
                type="button"
                className="btn btn-link btn-sm"
                onClick={onSubmit}
                disabled={loading}
              >
                Didn't receive the code? Resend
              </button>
            </div> */}
          </form>
        )}

        {/* Sign Up / Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/user/login" className="text-primary hover:underline font-medium">
              Login instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};








