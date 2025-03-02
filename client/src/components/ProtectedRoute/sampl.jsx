// src/components/shared/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowIncomplete = false, requiredRole }) => {

  const location = useLocation();
  
  // Get user states from Redux
  const user = useSelector((state) => state.user.user);
  const trainer = useSelector((state) => state.trainer.trainer);
  const admin = useSelector((state) => state.admin.admin);

  // Determine current authenticated entity
  const currentUser = user || trainer || admin;
  
  // If no authenticated user, redirect to appropriate login
  if (!currentUser) {
    const loginRoutes = {
      'user': '/user/login',
      'trainer': '/trainer/login',
      'admin': '/admin/login'
    };
    return <Navigate to={loginRoutes[requiredRole]} state={{ from: location }} replace />;
  }

  // Check role match
  if (currentUser.role !== requiredRole) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  // Handle specific role requirements
  switch (requiredRole) {
    case 'user':
      // Handle user profile completion check
      if (!allowIncomplete && !user.isProfileComplete && 
          location.pathname !== '/user/complete-profile') {
        return <Navigate to="/user/complete-profile" replace />;
      }
      
      // Prevent accessing complete-profile if already complete
      if (user.isProfileComplete && location.pathname === '/user/complete-profile') {
        return <Navigate to="/user/dashboard" replace />;
      }
      break;

    case 'trainer':
      // Handle trainer approval check
      if (!trainer.isApproved && location.pathname !== '/trainer/pending-approval') {
        return <Navigate to="/trainer/pending-approval" replace />;
      }
      break;

    case 'admin':
      // Add any admin-specific checks here
      break;

    default:
      return <Navigate to="/" replace />;
  }

  return children;
};








// // src/components/shared/ProtectedRoute.jsx
// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';
// import { clearUser } from '../../redux/features/userSlice';
// import { clearTrainer } from '../../redux/features/trainerSlice';
// import { clearAdmin } from '../../redux/features/adminSlice';

// export const ProtectedRoute = ({ children, allowIncomplete = false, requiredRole }) => {
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Get user states from Redux
//   const user = useSelector((state) => state.user.user);
//   const trainer = useSelector((state) => state.trainer.trainer);
//   const admin = useSelector((state) => state.admin.admin);

//   // Clear invalid persisted states
//   useEffect(() => {
//     if (!user && !trainer && !admin) {
//       // If no user is logged in, clear any stale Redux state
//       dispatch(clearUser());
//       dispatch(clearTrainer());
//       dispatch(clearAdmin());
//     }
//   }, [dispatch, user, trainer, admin]);

//   // Determine current authenticated entity
//   const currentUser = user || trainer || admin;

//   // If no authenticated user, redirect to appropriate login
//   if (!currentUser) {
//     const loginRoutes = {
//       'user': '/user/login',
//       'trainer': '/trainer/login',
//       'admin': '/admin/login'
//     };
//     return <Navigate to={loginRoutes[requiredRole]} state={{ from: location }} replace />;
//   }

//   // Check role match
//   if (currentUser.role !== requiredRole) {
//     return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
//   }

//   // Handle user profile completion
//   if (requiredRole === 'user') {
//     if (!allowIncomplete && !user.isProfileComplete && 
//         location.pathname !== '/user/complete-profile') {
//       return <Navigate to="/user/complete-profile" replace />;
//     }

//     if (user.isProfileComplete && location.pathname === '/user/complete-profile') {
//       return <Navigate to="/user/dashboard" replace />;
//     }
//   }

//   // Handle trainer approval
//   if (requiredRole === 'trainer') {
//     if (!trainer.isApproved && location.pathname !== '/trainer/pending-approval') {
//       return <Navigate to="/trainer/pending-approval" replace />;
//     }
//   }

//   return children;
// };





















// // src/components/shared/ProtectedRoute.jsx
// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';
// import { clearUser } from '../../redux/features/userSlice';
// import { clearTrainer } from '../../redux/features/trainerSlice';
// import { clearAdmin } from '../../redux/features/adminSlice';

// export const ProtectedRoute = ({ children, allowIncomplete = false, requiredRole }) => {
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Get user states from Redux
//   const user = useSelector((state) => state.user.user);
//   const trainer = useSelector((state) => state.trainer.trainer);
//   const admin = useSelector((state) => state.admin.admin);

//   // Clear invalid persisted states
//   useEffect(() => {
//     if (!user && !trainer && !admin) {
//       // If no user is logged in, clear any stale Redux state
//       dispatch(clearUser());
//       dispatch(clearTrainer());
//       dispatch(clearAdmin());
//     }
//   }, [dispatch, user, trainer, admin]);

//   // Determine current authenticated entity
//   const currentUser = user || trainer || admin;

//   // If no authenticated user, redirect to appropriate login
//   if (!currentUser) {
//     const loginRoutes = {
//       'user': '/user/login',
//       'trainer': '/trainer/login',
//       'admin': '/admin/login'
//     };
//     return <Navigate to={loginRoutes[requiredRole]} state={{ from: location }} replace />;
//   }

//   // Check role match
//   if (currentUser.role !== requiredRole) {
//     return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
//   }

//   // Handle user profile completion
//   if (requiredRole === 'user') {
//     if (!allowIncomplete && !user.isProfileComplete && 
//         location.pathname !== '/user/complete-profile') {
//       return <Navigate to="/user/complete-profile" replace />;
//     }

//     if (user.isProfileComplete && location.pathname === '/user/complete-profile') {
//       return <Navigate to="/user/dashboard" replace />;
//     }
//   }

//   // Handle trainer approval
//   if (requiredRole === 'trainer') {
//     if (!trainer.isApproved && location.pathname !== '/trainer/pending-approval') {
//       return <Navigate to="/trainer/pending-approval" replace />;
//     }
//   }

//   return children;
// };













// **********************************************
// ***********************************************

// My ProtectedRoute it was working fine but i change something so i am saving thid if i want this later 
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";

// export const ProtectedRoute = ({
//   children,
//   allowIncomplete = false,
//   requiredRole,
// }) => {
//   // *********
//   const [loading, setLoading] = useState(true);
//   // ***********

//   const location = useLocation();

//   // Get user, trainer, and admin details from Redux store
//   const user = useSelector((state) => state.user.user);
//   const trainer = useSelector((state) => state.trainer.trainer);
//   const admin = useSelector((state) => state.admin.admin);

//   // Determine the current authenticated user
//   const currentUser = user || trainer || admin;
//   const currentRole = currentUser.role;

//   useEffect(() => {
//     // auth check
//     console.log("inside Protected auth  useEffect setLoadingFalse ");
//     return setLoading(false);
//   }, []);

//   if (loading) {
//     // loading component
//     return <div>Loading ...</div>;
//   }

//   // Redirect to the appropriate login page if no user is logged in
//   if (!currentUser) {
//     const logginRoutes = {
//       user: "/user/login",
//       trainer: "/trainer/login",
//       admin: "/admin/login",
//     };
//     console.log("inside Protected auth  !uer ");
//     return (
//       <Navigate
//         to={logginRoutes[requiredRole]}
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   // Check if user role matches required role
//   // Restrict access if the user's role does not match the required role
//   if (currentRole !== requiredRole) {
//     console.log("currentRole != requiredRole ");
//     return <Navigate to={`/${currentRole}/dashboard`} replace />;
//   }

//   // Handle specific role requirements
//   switch (requiredRole) {
//     case "user":
//       if (
//         !allowIncomplete &&
//         !user.isProfileComplete &&
//         location.pathname !== "/user/complete-profile"
//       ) {
//         console.log("inside Protected auth  isProfileComplete false");
//         return <Navigate to="/user/complete-profile" replace />;
//       }
//       // Prevent accessing complete-profile if already complete
//       if (
//         user.isProfileComplete &&
//         location.pathname === "/user/complete-profile"
//       ) {
//         return <Navigate to="/user/dashboard" replace />;
//       }
//       break;
//     case "trainer":
//       // Handle trainer approval check
//       if (
//         !trainer.isApproved &&
//         location.pathname !== "/trainer/pending-approval"
//       ) {
//         return <Navigate to="/trainer/pending-approval" replace />;
//       }
//       break;
//     case "admin":
//       // Add any admin-specific checks here
//       break;

//     default:
//       return <Navigate to="/" replace />;
//   }

//   return children;
// };

