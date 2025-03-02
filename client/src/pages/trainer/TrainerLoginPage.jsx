import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { trainerLogin } from "../../services/trainerServices";
import { setIsApproved, setTrainer } from "../../redux/features/trainerSlice";

export const TrainerLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, trainer } = useSelector((state) => state.trainer);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!values.email || !values.password) {
      // return setError("Please fill in all fields");
      toast.error("Please fill in all fields");
    }

    try {
      const response = await trainerLogin(values);
      const trainerData = response.data.user;

      console.log("trainer login");
      

      dispatch(setTrainer(trainerData));
      dispatch(setIsApproved(trainerData.isApproved));

      toast.success("Login successful!");

      setTimeout(() => {
        if (trainerData.isApproved) {
          navigate("/trainer/dashboard");
        } else {
          navigate("/trainer/pending-approval");
        }
      }, 100);
    } catch (error) {
      console.error(error);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    console.log("Updated trainer state in Redux:", {
      isAuthenticated,
      trainer});
  }, [isAuthenticated, trainer]);

  const handleForgotPassword = () => {
    navigate("/forgot-password", { state: { role: "trainer" } });
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent p-7">
      <form onSubmit={onSubmit} className="p-7">
        <div className="p-7">
          {/* Email */}
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="email"
              name="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            <label
              htmlFor="floating_email"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="password"
              name="password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            <label
              htmlFor="floating_password"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-right">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Not registered?
              <Link
                to="/trainer/signup"
                className="text-blue-600 hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
