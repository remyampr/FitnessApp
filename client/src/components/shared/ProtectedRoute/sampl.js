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


















// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Trainer = require("../Models/Trainer");
const Admin = require("../Models/Admin");

// Middleware for Authentication (protect)
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("inside protect cookie received:", token);

    if (!token) {
      return res.status(401).json({ 
        isAuthenticated: false,
        error: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user based on decoded token
    const user = await User.findById(decoded.id) || 
                await Trainer.findById(decoded.id) || 
                await Admin.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        isAuthenticated: false,
        error: "User not found." 
      });
    }

    // Attach full user object to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ 
      isAuthenticated: false,
      msg: "Invalid token" 
    });
  }
};

// Middleware for Authorization (authorize)
const authorize = (roles = []) => {
  return async (req, res, next) => {
    console.log("1.authorization role:", roles);
    try {
      const user = req.user; // User is already attached from protect middleware

      // Check if user's role matches one of the required roles
      if (roles.length && !roles.includes(user.role.toLowerCase())) {
        console.log("3.authorization role:", roles);
        return res.status(403).json({ 
          msg: "Forbidden: You do not have permission for this action." 
        });
      }

      next();
    } catch (error) {
      res.status(400).json({ error: "Authorization error." });
    }
  };
};

// Check auth status helper function
const checkAuthStatus = async (req, res) => {
  try {
    const user = req.user; // User is already attached from protect middleware
    
    // Clean user data before sending
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved // For trainers
    };

    res.json({
      isAuthenticated: true,
      userData,
      role: user.role,
      message: 'Authentication valid'
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      isAuthenticated: false,
      message: 'Internal server error during auth check'
    });
  }
};

module.exports = { protect, authorize, checkAuthStatus };