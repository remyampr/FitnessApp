import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { trainerLogin } from "../../services/trainerServices";
import { setIsApproved, setTrainer } from "../../redux/features/trainerSlice";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash  } from 'react-icons/fa';

export const TrainerLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, trainer } = useSelector((state) => state.trainer);

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!values.email || !values.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await trainerLogin(values);
      const trainerData = response.data.user;

      console.log("trainer login");
      
      dispatch(setTrainer(trainerData));
      dispatch(setIsApproved(trainerData.isApproved));

      toast.success("Login successful!");

      if (trainerData.isApproved) {
        navigate("/trainer/dashboard");
      } else {
        navigate("/trainer/pending-approval");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated trainer state in Redux:", {
      isAuthenticated,
      trainer
    });
  }, [isAuthenticated, trainer]);

  const handleForgotPassword = () => {
    navigate("/forgot-password", { state: { role: "trainer" } });
  };

  return (
    <div className="flex items-center justify-center min-h-[110vh]">
      <div className="max-w-md w-full bg-base-300/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Trainer Login</h2>
        
        <form onSubmit={onSubmit}>
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
                className="input input-bordered w-full pl-10"
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
                className="input input-bordered w-full pl-10 pr-10"
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
            <Link to="/trainer/signup" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};