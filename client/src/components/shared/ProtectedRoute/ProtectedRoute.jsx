import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({
  children,
  allowIncomplete = false,
  requiredRole,
}) => {
  // *********
  const [loading, setLoading] = useState(true);
  // ***********

  const location = useLocation();

  // Get user, trainer, and admin details from Redux store
  const user = useSelector((state) => state.user.user);
  const trainer = useSelector((state) => state.trainer.trainer);
  const admin = useSelector((state) => state.admin.admin);

  // Determine the current authenticated user
  const currentUser = user || trainer || admin;
  const currentRole = currentUser.role;

  useEffect(() => {
    // auth check
    console.log("inside Protected auth  useEffect setLoadingFalse ");
    return setLoading(false);
  }, []);

  if (loading) {
    // loading component
    return <div>Loading ...</div>;
  }

  // Redirect to the appropriate login page if no user is logged in
  if (!currentUser) {
    const logginRoutes = {
      user: "/user/login",
      trainer: "/trainer/login",
      admin: "/admin/login",
    };
    console.log("inside Protected auth  !uer ");
    return (
      <Navigate
        to={logginRoutes[requiredRole]}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check if user role matches required role
  // Restrict access if the user's role does not match the required role
  if (currentRole !== requiredRole) {
    console.log("currentRole != requiredRole ");
    return <Navigate to={`/${currentRole}/dashboard`} replace />;
  }

  // Handle specific role requirements
  switch (requiredRole) {
    case "user":
      if (
        !allowIncomplete &&
        !user.isProfileComplete &&
        location.pathname !== "/user/complete-profile"
      ) {
        console.log("inside Protected auth  isProfileComplete false");
        return <Navigate to="/user/complete-profile" replace />;
      }
      // Prevent accessing complete-profile if already complete
      if (
        user.isProfileComplete &&
        location.pathname === "/user/complete-profile"
      ) {
        return <Navigate to="/user/dashboard" replace />;
      }
      break;
    case "trainer":
      // Handle trainer approval check
      if (
        !trainer.isApproved &&
        location.pathname !== "/trainer/pending-approval"
      ) {
        return <Navigate to="/trainer/pending-approval" replace />;
      }
      break;
    case "admin":
      // Add any admin-specific checks here
      break;

    default:
      return <Navigate to="/" replace />;
  }

  return children;
};
