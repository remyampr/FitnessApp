// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';
// import { clearUser } from '../../redux/features/userSlice';




// // Full protection - for dashboard and other fully protected pages
// export const UserProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.user);
  
//   console.log("inside userProtectedRoute: isProfileComplete:", user?.isProfileComplete, user);
  
//   const isProfileComplete = user?.isProfileComplete || false;
//   const subscriptionStatus = user?.subscription?.status || "Inactive";
//   const isUserLoggedIn = !!user;
  
//   useEffect(() => {
//     // If user exists in state but doesn't have essential properties, clear the user state
//     if (isUserLoggedIn && !user?.id) {
//       dispatch(clearUser());
//     }
//   }, [dispatch,  isUserLoggedIn,user]);

//   // Check if user is logged in
//   if (!isUserLoggedIn) {
//     return <Navigate to="/user/login" state={{ from: location }} replace />;
//   }
  
//   // Check if profile is complete
//   if (!isProfileComplete &&  subscriptionStatus !== "Active" ) {
//     return <Navigate to="/user/complete-profile" state={{ from: location }} replace />;
//   }
  
  

  
//   // If all conditions are met, render the protected content (the children)
//   return children;
// };