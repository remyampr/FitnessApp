import React from "react";
import { DarkMode } from "../shared/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../services/userServices";
import { clearUser } from "../../redux/features/userSlice";
import { persistor } from "../../redux/store";
import { LogOut } from "lucide-react";
import { FaDumbbell } from 'react-icons/fa';

export const UserNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  // console.log("navbar USer :",user);

  const name = user?.user?.name;
  const handleLogout = async () => {
    try {
      await userLogout();
      dispatch(clearUser());

      persistor.purge();
      sessionStorage.clear();
      localStorage.clear();
      // console.log("navigating to userlogin");

      navigate("/user/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile sidebar toggle button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-md text-base-content hover:bg-base-200"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          {/* <div className="flex-1 flex justify-center md:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">FitMaster</span>
            </div>
          </div> */}

<div className="flex-1 flex justify-center md:justify-start">
        <Link to={"/user/dashboard"} className="flex items-center space-x-2 text-xl font-bold hover:text-primary transition-colors">
          <FaDumbbell className="text-primary text-2xl" />
          <span className="text-2xl tracking-wider">FitMaster</span>
        </Link>
      </div>

          <div className="flex items-center ">
            {/* Align items in a row */}
            <span className="font-mediumtext-3xl font-bold text-white-600 font-mono">
              Welcome, {name}!
            </span>

            <button
              onClick={handleLogout}
              className="btn btn-ghost text-red-500 hover:bg-transparent"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>

            {/* <Notification /> */}
            <DarkMode />
          </div>
        </div>
      </div>
    </nav>
  );
};
