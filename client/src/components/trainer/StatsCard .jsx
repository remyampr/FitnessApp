import React from 'react';

export const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color}`}>
            <i className={`fa fa-${icon} text-white text-xl`}></i>
          </div>
          <div>
            <h2 className="card-title text-base-content opacity-70 text-sm">{title}</h2>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
