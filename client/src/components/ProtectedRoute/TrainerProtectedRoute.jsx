import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { clearTrainer } from '../../redux/features/trainerSlice';

export const TrainerProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get trainer state from the trainer reducer
  const trainerState = useSelector((state) => state.trainer);
  const { isAuthenticated,  trainer } = trainerState;
  // const { isAuthenticated, loading, trainer } = trainerState;
  
  console.log("trainerProtectedRoute - auth state:", { 
    isAuthenticated, 
    // loading,
    trainer
  });
  
  // Check if the trainer has the isApproved property
  const isApproved = trainer?.isApproved || false;

  useEffect(() => {
  
    const trainerExists = trainer && Object.keys(trainer).length > 0;
    if (!trainerExists && isAuthenticated) {
      dispatch(clearTrainer());
    }
  }, [dispatch, trainer?.id]); 

  // Show loading indicator if state is still loading
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !trainer || Object.keys(trainer).length === 0) {
    return <Navigate to="/trainer/login" replace />;
  }
  
  // Handle routing based on approval status
  if (isApproved) {
    // If approved and trying to access pending approval page, redirect to dashboard
    if (location.pathname === "/trainer/pending-approval") {
      return <Navigate to="/trainer/dashboard" replace />;
    }
  } else {
    // If not approved and trying to access dashboard, redirect to pending approval
    if (location.pathname === "/trainer/dashboard" || location.pathname.startsWith("/trainer/dashboard/")) {
      return <Navigate to="/trainer/pending-approval" replace />;
    }
  }
  
  // If all checks pass, render the children
  return children;
};