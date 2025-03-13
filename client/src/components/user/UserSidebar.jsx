import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

export const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  
  const navItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/user/mytrainer', label: 'My Trainer', icon: 'fas fa-running' },
    { path: '/user/appointments', label: 'Appointments', icon: 'fas fa-calendar-alt' },
    { path: '/user/workouts', label: 'Workouts', icon: 'fas fa-dumbbell' },
    { path: '/user/nutrition', label: 'Nutrition Plans', icon: 'fas fa-utensils' },
    { path: '/user/progress', label: 'Progress', icon: 'fas fa-chart-line' },
    { path: '/user/profile', label: 'My Profile', icon: 'fas fa-user' },
  ];
  
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed md:static z-20 h-full bg-base-200 text-base-content transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 left-0' : 'w-64 -left-64'
        } md:w-64 md:left-0`}
      >
        <div className="p-4 border-b border-base-300 flex flex-col items-center">
          {/* Mobile close button */}
          <button 
            className="absolute top-4 right-4 md:hidden text-base-content"
            onClick={toggleSidebar}
          >
            <i className="fas fa-times"></i>
          </button>
          
          {user?.image && (
            <img
              src={user.image}
              alt="User Profile"
             className="w-32 h-32 rounded-full border-2 border-gray-300 shadow-lg"
            />
          )}
          <h1 className="text-2xl font-bold mt-2">Your Fitness Journey</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="menu menu-compact p-2 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-300'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                >
                  <i className={`${item.icon} w-5 h-5 mr-2`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};