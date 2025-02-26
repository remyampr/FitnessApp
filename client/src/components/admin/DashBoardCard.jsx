import React from "react";
import { Link } from "react-router-dom";

export const DashboardCard = ({
  title,
  iconColor,
  iconPath,
  link,
  linkText,
  value,
}) => {
  // Extract the text color class from iconColor to apply to link
  const textColorClass = iconColor.split(" ").find(cls => cls.startsWith("text-"));
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-lg">{title}</h2>
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d={iconPath}></path>
            </svg>
          </div>
        </div>
        <p className="text-3xl font-bold mt-2">{value}</p>
        {link && (
          <div className="card-actions mt-4">
            <Link to={link} className={`text-sm hover:underline ${textColorClass}`}>
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};