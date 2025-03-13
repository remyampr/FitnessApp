import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminForgotPassword,
  adminResetPassword,
} from "../../services/adminServices";
import { toast } from "react-toastify";
import { AlertError } from "../../components/shared/AlertError";

export const AdminForgotPassword = () => {
  
  const navigate=useNavigate();
  const [data, setData] = useState({
    email: "",
    role: "admin",
  });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!data.email) {
      return setError("Please enter your email");
    }
    try {
      setMessage("");
      setError("");
      setLoading(true);

      const response = await adminForgotPassword(data);
      setMessage("OTP sent to your email. Please check.");
      // toast.success(response.data.msg);
      // setMaskedEmail(maskEmail(data.email));
      setIsEmailSubmitted(true); // Show OTP and new password fields
    } catch (err) {
      setError("Failed to send OTP. Please check your email.");
      // toast.error(response.data.error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const maskEmail = (email) => {
  //   const [name, domain] = email.split("@");
  //   return name.slice(0, 2) + "***@" + domain;
  // };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      return setError("Please enter OTP and new password.");
    }
    try {
      setMessage("");
      setError("");
      setLoading(true);
      const response = await adminResetPassword(data.email, otp, newPassword);
      setMessage("Password has been reset successfully.");
      toast.success(response.data.message);
      console.log("role:",data.role);
      
      navigate(`/${data.role}/login`);
    } catch (err) {
      setError("Failed to reset password. Please check the OTP.");
      console.error(err);
      console.log(error.response, error);

      toast.error(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-6">
            Reset Admin Password
          </h2>

          {error && (
           <AlertError error={error} />
          )}

          {message && (
            <div className="alert alert-success mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {!isEmailSubmitted ? (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your admin email"
                  className="input input-bordered"
                  name="email"
                  onChange={(e) => {
                    setData({ ...data, [e.target.name]: e.target.value });
                  }}
                />
                required
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link to="/admin/login" className="link link-hover text-sm">
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">OTP</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the OTP sent to your email"
                  className="input input-bordered"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  className="input input-bordered"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link to="/admin/login" className="link link-hover text-sm">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
