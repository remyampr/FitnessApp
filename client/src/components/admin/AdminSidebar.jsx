import React from "react";
import { Link, useLocation } from "react-router-dom";

export const AdminSidebar = () => {
  const location = useLocation();

  // const isActive = (path) => {
  //   return location.pathname === path ? "active" : "";
  // };

  const isActive = (path, exactQuery = "") => {
    if (exactQuery) {
      return location.pathname === path && location.search === `?${exactQuery}`
        ? "bg-gray-200 text-blue-600 font-semibold"
        : "";
    }
    return location.pathname === path && !location.search
      ? "bg-gray-200 text-blue-600 font-semibold"
      : "";
  };

  return (
    <div className="bg-base-100 shadow-lg h-full">
      <ul className="menu p-4 w-64 text-base-content">
        {/* <li className={isActive("/admin/dashboard")}> */}
        <li className={`p-2 rounded-md ${isActive("/admin/dashboard")}`}>
          <Link to="/admin/dashboard">
            <i className="fas fa-tachometer-alt text-lg"></i>
            Dashboard
          </Link>
        </li>
        <li className={`p-2 rounded-md ${isActive("/admin/users")}`}>
          <Link to="/admin/users">
          <i className="fas fa-users text-lg"></i>
            Users
          </Link>
        </li>
        <li className={`p-2 rounded-md ${isActive("/admin/users", "type=trainer")}`}>
          <Link to="/admin/users?type=trainer">
          <i className="fas fa-user-tie text-lg"></i>
            Trainers
          </Link>
        </li>
        <li className={`p-2 rounded-md ${isActive("/admin/trainers/unapproved")}`}>
          <Link to="/admin/trainers/unapproved">
          <i className="fas fa-user-check text-lg"></i>
            Approvals
          </Link>
        </li>
        <li className={`p-2 rounded-md ${isActive("/admin/revenue")}`}>
          <Link to="/admin/revenue">
          <i className="fas fa-indian-rupee-sign text-lg"></i>
          Revenue
          </Link>
        </li>
        <li className={`p-2 rounded-md ${isActive("/admin/appointments")}`}>
          <Link to="/admin/appointments">
          <i className="fas fa-calendar-check text-lg"></i>
          Appointments
          </Link>
        </li>
        <li className={`p-2 rounded-md ${isActive("/admin/workouts")}`}>
          <Link to="/admin/workouts">
          <i className="fas fa-dumbbell text-lg"></i>
          Workouts
          </Link>
        </li>
        <li className={`p-2 rounded-md ${isActive("/admin/nutritionplans")}`}>
          <Link to="/admin/nutritionplans">
          <i className="fas fa-utensils text-lg"></i>
          Nutrition Plans
          </Link>
        </li>
     
      </ul>
    </div>
  );
};
