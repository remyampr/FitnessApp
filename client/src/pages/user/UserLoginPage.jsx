import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../../services/userServices';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileComplete, setUser } from '../../redux/features/userSlice';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export const UserLoginPage = () => {
  console.log("UserLoginPage rendered!");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isProfileComplete = useSelector(state => state.user.isProfileComplete);

const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (!values.email || !values.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    userLogin(values)
      .then((res) => {
        if (res.data && res.data.user) {
          // console.log("login time res got , : ", res);
          
          dispatch(setUser(res.data.user));
          dispatch(setProfileComplete(res.data.user.isProfileComplete));
          
          // console.log("login res : ", res);
          toast.success("Login successful!");
          // console.log("isProfilecompleted ?: ", isProfileComplete);
          
          if (res.data.user.isProfileComplete) {
            navigate("/user/dashboard");
          } else {
            navigate("/user/complete-profile");
          }
        } else {
          console.error("Login API response does not contain user data");
          toast.error("Login failed. Please try again.");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("An unexpected error occurred.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password", { state: { role: "user" } });
  };

  return (
    <div className="flex items-center justify-center min-h-[110vh]">
      <div className="max-w-md w-full bg-base-300/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        
        <form onSubmit={onSubmit}>
          {/* Email Field */}
          <div className="form-control w-full mb-4 ">
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
                className="input input-bordered w-full pl-10  "
                placeholder="Enter your email"
                required
              />
            </div>
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
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                className="input input-bordered w-full pl-10 pr-10 "
                placeholder="Enter your password"
                required
              />
              <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Not registered?{' '}
            <Link to="/user/signup" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};