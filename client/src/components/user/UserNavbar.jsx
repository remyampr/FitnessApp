import React from "react";
import { DarkMode } from "../shared/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Notification } from "./Notification";
import { userLogout } from "../../services/userServices";
import { clearUser } from "../../redux/features/userSlice";
import { persistor } from "../../redux/store";
import { LogOut } from "lucide-react";

export const UserNavbar = () => {
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
    <div className="navbar bg-primary text-primary-content shadow-lg px-4">
    <div className="flex-1">
      <Link to="/user/dashboard">
        <h1 className="text-xl font-bold">LOGOO</h1>
      </Link>
    </div>
    <div className="flex items-center gap-4">
      {/* Align items in a row */}
      <span className="font-medium">
        <h1 className="text-3xl font-bold text-white-600 font-mono">
          Welcome, {name}!
        </h1>
      </span>
  
      <button
        onClick={handleLogout}
        className="btn btn-ghost text-red-500 hover:bg-transparent"
      >
        <LogOut size={20} className="mr-2" />
        Logout
      </button>
  
      <Notification />
      <DarkMode />
    </div>
  </div>
  
  );
};















