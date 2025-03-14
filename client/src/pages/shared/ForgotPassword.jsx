import React, { useState } from 'react'
import { userForgotPassword, userResetPassword } from '../../services/userServices';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { trainerForgotPassword, trainerResetPassword } from '../../services/trainerServices';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';

export const ForgotPassword = () => {
  const location = useLocation();
  const role = location.state?.role || "unknown";
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [data, setData] = useState({
    email: "",
    role: role
  });
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("Role ForgotPassword : ", data.role);

  const handleSendOTP = async () => {
    try {
      console.log("step : ", step);
      setLoading(true);
      
      if (data.role === "user") {
        const response = await userForgotPassword(data);
        console.log("at handle otp data : ", data);
        console.log("at handle otp response : ", response);
      }
      else if (data.role === "trainer") {
        const response = await trainerForgotPassword(data);
        console.log("at handle otp data : ", data);
        console.log("at handle otp response : ", response);
      }
      
      toast.success("OTP sent successfully");
      setMaskedEmail(maskEmail(data.email));
      setStep("otp");
    } catch (error) {
      console.log(error.response, error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "***@" + domain;
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      
      if (data.role === "user") {
        const response = await userResetPassword(data.email, otp, newPassword);
        console.log("at handle resetPassword data : ", data);
        console.log("at handle resetPassword response : ", response);
      } else if (data.role === "trainer") {
        const response = await trainerResetPassword(data.email, otp, newPassword);
        console.log("at handle resetPassword data : ", data);
        console.log("at handle resetPassword response : ", response);
      }
      
      toast.success("Password reset successfully");
      navigate(`/${data.role}/login`);
    } catch (error) {
      console.log(error.response, error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[110vh]">
      <div className="max-w-md w-full bg-base-300/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        {step === "email" ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password?</h2>
            <p className="text-sm  text-center mb-6">Enter your email to receive a reset OTP.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }}>
              {/* Email Field */}
              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your email"
                    required
                    value={data.email}
                    onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
            
            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                Remember your password?{' '}
                <a 
                  onClick={() => navigate(`/${data.role}/login`)} 
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Back to Login
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
            <p className="text-sm  text-center mb-6">
              We've sent an OTP to <strong>{maskedEmail}</strong>
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
              {/* OTP Field */}
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-medium">OTP</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaKey className="" />
                  </div>
                  <input
                    type="text"
                    name="otp"
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text font-medium">New Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    className="input input-bordered w-full pl-10 pr-10"
                    placeholder="Enter new password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 "
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            
            {/* Back to Email Step */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                Didn't receive the OTP?{' '}
                <a 
                  onClick={() => setStep("email")} 
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Try again
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}