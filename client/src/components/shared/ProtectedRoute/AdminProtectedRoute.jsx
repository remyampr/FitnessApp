import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { clearAdmin } from '../../../redux/features/adminSlice';

export const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Fetch admin state
  const adminState = useSelector((state) => state.admin);
//   const admin = adminState?.admin?.admin || null; // Adjust based on state structure
  const admin = adminState.admin // Adjust based on state structure
  const isAuthenticated = adminState?.admin?.isAuthenticated || false;

  // console.log("AdminProtectedRoute - Admin State:", admin);
  // console.log("AdminProtectedRoute - isAuthenticated:", isAuthenticated);

  // Clear stale state if admin is null
  useEffect(() => {
    if (!admin) {
      dispatch(clearAdmin());
    }
  }, [dispatch, admin]);

  // Redirect if not authenticated
  if (!admin || !isAuthenticated) {
    // console.log("Redirecting to admin login...");
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect to admin dashboard if already authenticated
  // if (location.pathname !== "/admin/dashboard") {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }

  return children;
};

