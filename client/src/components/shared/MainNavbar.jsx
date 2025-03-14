import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell } from 'react-icons/fa';
import { DarkMode } from './DarkMode'; 

export const MainNavbar = () => {
  return (
    <div className="navbar fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-gray-800/40 px-6 md:px-12 py-4">
      <div className="navbar-start">
        <Link to={"/"} className="flex items-center space-x-2 text-xl font-bold text-white hover:text-primary transition-colors">
          <FaDumbbell className="text-primary text-2xl" />
          <span className="text-2xl tracking-wider">FitMaster</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden md:flex">
        <ul className="flex space-x-8">
          <li><Link to="/our-trainers" className="text-gray-300 hover:text-white font-medium transition-colors">Trainers</Link></li>
          <li><Link to="/pricing" className="text-gray-300 hover:text-white font-medium transition-colors">Pricing</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end flex items-center space-x-4">
        <DarkMode />
        <div className="hidden md:flex space-x-3">
          <Link to="/user/login" className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-black">Login</Link>
          <Link to="/user/signup" className="btn btn-sm btn-primary">Sign Up</Link>
        </div>
        <div className="md:hidden">
          <button className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};