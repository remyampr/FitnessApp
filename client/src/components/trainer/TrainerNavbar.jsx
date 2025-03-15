import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { trainerLogout } from '../../services/trainerServices';
import { clearTrainer } from '../../redux/features/trainerSlice';
import { persistor } from '../../redux/store';
import { DarkMode } from '../shared/DarkMode';

export const TrainerNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 


  const trainer = useSelector((state) => state.trainer);

  let name;
  if(trainer.name){
    name=trainer.name;
  }
  else if(trainer.trainer.name){
    name=trainer.trainer.name
  }
  
// console.log("Inside nav : trainer ",trainer);


  const handleLogout = async () => {
    try {
     
        await trainerLogout();
        dispatch(clearTrainer()); 
   
      
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
        {/* Hamburger menu for mobile */}
        <button 
          className="md:hidden mr-4 text-xl" 
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      <div className="flex items-center w-full p-2">
      <h1 className="text-2xl font-bold">FitMaster</h1> 
      <div className="flex items-center gap-6 ml-auto">
    <div className="flex items-center gap-2">
      <i className="fa fa-user-circle text-xl"></i>
      <span className="font-medium">{name}</span>
    </div>
    
    <button 
      onClick={handleLogout}
      className="btn btn-sm btn-outline"
    >
      <i className="fa fa-sign-out-alt mr-2"></i>
      Logout
    </button>
    
    <DarkMode className="mr-6" />
  </div>
      </div>
    </div>
  );
};