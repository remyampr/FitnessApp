import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { trainerLogout } from '../../services/trainerServices';
import { clearTrainer } from '../../redux/features/trainerSlice';
import { persistor } from '../../redux/store';
import { clearUser } from '../../redux/features/userSlice';
import { userLogout } from '../../services/userServices';
import { DarkMode } from '../shared/DarkMode';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();

 const user = useSelector((state) => state.user);
  const trainer = useSelector((state) => state.trainer);
  
  const currentUser = user?.user || trainer?.trainer;

  const name = currentUser.name;


    const handleLogout = async () => {
      try {
        // Check which type of user is logged in
        if (user?.user) {
          await userLogout();
          dispatch(clearUser());
        } else if (trainer?.trainer) {
          await trainerLogout();
          dispatch(clearTrainer()); 
        }
        
        // Clear persisted state
        persistor.purge();
        sessionStorage.clear();
        localStorage.clear();
        
        // Navigate to home page
        navigate("/");
      } catch (err) {
        console.error("Logout error:", err);
      }
    };
   
  return (
    <div className="bg-base-100 border-b border-base-300 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold"> Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <i className="fa fa-user-circle text-xl mr-2"></i>
          <span className="font-medium">{name}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="btn btn-sm btn-outline"
        >
          <i className="fa fa-sign-out-alt mr-2"></i>
          Logout
        </button>
          <DarkMode />
      </div>
    </div>
  );
};