import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Sidebar = () => {

    const location=useLocation();

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

    <div className="hidden md:flex flex-col w-64 bg-base-200 text-base-content">
    <div className="p-4 border-b border-base-300">
      <h1 className="text-2xl font-bold">FitTrainer</h1>
      
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
