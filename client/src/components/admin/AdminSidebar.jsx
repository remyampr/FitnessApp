import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  CheckSquare, 
  IndianRupee, 
  Calendar, 
  Dumbbell, 
  Utensils 
} from "lucide-react";

export const AdminSidebar = ({ isMobile, closeSidebar }) => {
  const location = useLocation();

  const isActive = (path, exactQuery = "") => {
    if (exactQuery) {
      return location.pathname === path && location.search === `?${exactQuery}`
        ? "bg-primary/10 text-primary font-semibold"
        : "";
    }
    return location.pathname === path && !location.search
      ? "bg-primary/10 text-primary font-semibold"
      : "";
  };

  const handleLinkClick = () => {
    // Only close sidebar on click if on mobile
    if (isMobile) {
      closeSidebar && closeSidebar();
    }
  };

  return (
    <div className="bg-base-100 shadow-lg h-full w-64">
      <div className="p-4 font-bold text-lg border-b border-gray-200 mb-2 hidden md:block">
        Navigation
      </div>
      <ul className="menu p-4 w-full text-base-content">
        <li className={`mb-1 rounded-md ${isActive("/admin/dashboard")}`}>
          <Link to="/admin/dashboard" onClick={handleLinkClick} className="flex items-center p-2">
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
        </li>
        <li className={`mb-1 rounded-md ${isActive("/admin/users")}`}>
          <Link to="/admin/users" onClick={handleLinkClick} className="flex items-center p-2">
            <Users className="w-5 h-5 mr-2" />
            Users
          </Link>
        </li>
        <li className={`mb-1 rounded-md ${isActive("/admin/users", "type=trainer")}`}>
          <Link to="/admin/users?type=trainer" onClick={handleLinkClick} className="flex items-center p-2">
            <UserCog className="w-5 h-5 mr-2" />
            Trainers
          </Link>
        </li>
        <li className={`mb-1 rounded-md ${isActive("/admin/approvals")}`}>
          <Link to="/admin/approvals" onClick={handleLinkClick} className="flex items-center p-2">
            <CheckSquare className="w-5 h-5 mr-2" />
            Approvals
          </Link>
        </li>
        <li className={`mb-1 rounded-md ${isActive("/admin/revenue")}`}>
          <Link to="/admin/revenue" onClick={handleLinkClick} className="flex items-center p-2">
            <IndianRupee className="w-5 h-5 mr-2" />
           
            Revenue
          </Link>
        </li>
        <li className={`mb-1 rounded-md ${isActive("/admin/appointments")}`}>
          <Link to="/admin/appointments" onClick={handleLinkClick} className="flex items-center p-2">
            <Calendar className="w-5 h-5 mr-2" />
            Appointments
          </Link>
        </li>
        <li className={`mb-1 rounded-md ${isActive("/admin/workouts")}`}>
          <Link to="/admin/workouts" onClick={handleLinkClick} className="flex items-center p-2">
            <Dumbbell className="w-5 h-5 mr-2" />
            Workouts
          </Link>
        </li>
        <li className={`mb-1 rounded-md ${isActive("/admin/nutrition")}`}>
          <Link to="/admin/nutrition" onClick={handleLinkClick} className="flex items-center p-2">
            <Utensils className="w-5 h-5 mr-2" />
            Nutrition Plans
          </Link>
        </li>
      </ul>
    </div>
  );
};