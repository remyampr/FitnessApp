import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const navItems = [
      { path: '/trainer/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: '/trainer/clients', label: 'Clients', icon: 'fas fa-users' },
      { path: '/trainer/appointments', label: 'Appointments', icon: 'fas fa-calendar-alt' },
      { path: '/trainer/workouts', label: 'Workouts', icon: 'fas fa-dumbbell' },
      { path: '/trainer/nutrition', label: 'Nutrition Plans', icon: 'fas fa-utensils' },
      { path: '/trainer/revenue', label: 'Revenue', icon: 'fas fa-indian-rupee-sign' },
      { path: '/trainer/profile', label: 'Profile', icon: 'fas fa-user' },
    ];

    return (
      <>
        {/* Mobile overlay - appears when sidebar is open on mobile */}
        {isOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar - only visible on mobile when isOpen is true */}
        <div 
          className={`
            fixed md:static z-30 bg-base-200 text-base-content h-full
            transition-all duration-300 ease-in-out
            ${isOpen ? 'w-64 translate-x-0' : 'md:w-64 -translate-x-full md:translate-x-0'}
            ${isOpen || window.innerWidth >= 768 ? 'flex flex-col' : 'hidden md:flex md:flex-col'}
          `}
        >
          <div className="p-4 border-b border-base-300 flex justify-between items-center">
            {/* <h1 className="text-2xl font-bold">FitTrainer</h1> */}
            {/* Close button - only visible when sidebar is open on mobile */}
            {isOpen && (
              <button 
                className="md:hidden text-xl" 
                onClick={toggleSidebar}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
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
                      if (isOpen && window.innerWidth < 768) toggleSidebar(); // Close sidebar on mobile after navigation
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
    )
}