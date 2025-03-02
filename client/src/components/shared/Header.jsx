import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../redux/store";
import { clearUser } from "../../redux/features/userSlice";
import { userLogout } from "../../services/userServices";
import { trainerLogout } from "../../services/trainerServices";
import { clearTrainer } from "../../redux/features/trainerSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.user);
  const trainer = useSelector((state) => state.trainer);
  
  const currentUser = user?.user || trainer?.trainer;
  console.log("cuurent user at landing page : ",currentUser);
  
  
  // const handleLogout = async () => {
  //   try {
  //     // Check which type of user is logged in
  //     if (user?.user) {
  //       await userLogout();
  //       dispatch(clearUser());
  //     } else if (trainer?.trainer) {
  //       await trainerLogout();
  //       dispatch(clearTrainer()); 
  //     }
      
  //     // Clear persisted state
  //     persistor.purge();
  //     sessionStorage.clear();
  //     localStorage.clear();
      
  //     // Navigate to home page
  //     navigate("/");
  //   } catch (err) {
  //     console.error("Logout error:", err);
  //   }
  // };
  
  return (
    <div className="navbar bg-transparent backdrop-blur-sm border-none shadow-none rounded-lg flex justify-between items-center px-9">
      <Link
        to={
          currentUser && Object.keys(currentUser || {}).length > 0
            ? `/${currentUser.role}/dashboard`
            : "/"
        }
        className="btn btn-ghost text-xl mx-auto"
      >
        FitIt
      </Link>

      <div className="navbar-end flex items-center space-x-4">
      <DarkMode />
      </div>



      {/* <div className="navbar-end flex items-center space-x-4">
        {currentUser && Object.keys(currentUser || {}).length > 0 ? (
          <div className="flex items-center space-x-3">
            <span>{currentUser.name}</span>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <span></span>
        )}
        
        <DarkMode />
      </div> */}
    </div>
  );
};
