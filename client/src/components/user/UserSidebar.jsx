import React from 'react'
import { Link, useLocation } from 'react-router-dom';

export const UserSidebar = () => {

  const location=useLocation();

  const navItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/user/trainer', label: 'Clients', icon: 'fas fa-users' },
    { path: '/user/appointments', label: 'Appointments', icon: 'fas fa-calendar-alt' },
    { path: '/user/workouts', label: 'Workouts', icon: 'fas fa-dumbbell' },
    { path: '/user/nutrition', label: 'Nutrition Plans', icon: 'fas fa-utensils' },
    { path: '/user/progress', label: 'Progress', icon: 'fas fa-chart-line' } ,
 
    { path: '/user/profile', label: 'Profile', icon: 'fas fa-user' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-base-200 text-base-content">
    <div className="p-4 border-b border-base-300">
      <h1 className="text-2xl font-bold"> Your Fitness Journey</h1>
      
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
            >
               <i className={`${item.icon} w-5 h-5 mr-2`}></i>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
  )
}
