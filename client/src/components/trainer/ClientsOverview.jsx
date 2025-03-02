// components/trainer/dashboard/ClientsOverview.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ClientsOverview = ({ clients }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  if (!clients || clients.length === 0) {
    return (
      <div className="alert alert-info">
        <div>
          <span>No clients found. Start adding clients to see them here.</span>
        </div>
      </div>
    );
  }
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedClients = [...clients].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'workouts') {
      comparison = (a.workouts?.length || 0) - (b.workouts?.length || 0);
    } else if (sortField === 'plans') {
      comparison = (a.nutritionPlans?.length || 0) - (b.nutritionPlans?.length || 0);
    } else if (sortField === 'activity') {
      comparison = new Date(b.lastActive) - new Date(a.lastActive);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th 
              className="cursor-pointer" 
              onClick={() => handleSort('name')}
            >
              Name
              {sortField === 'name' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th 
              className="cursor-pointer" 
              onClick={() => handleSort('workouts')}
            >
              Active Workouts
              {sortField === 'workouts' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th 
              className="cursor-pointer" 
              onClick={() => handleSort('plans')}
            >
              Nutrition Plans
              {sortField === 'plans' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th 
              className="cursor-pointer" 
              onClick={() => handleSort('activity')}
            >
              Last Active
              {sortField === 'activity' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.slice(0, 5).map((client) => (
            <tr key={client.id}>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-10 h-10">
                      <img 
                        src={client.avatar || '/avatar-placeholder.png'} 
                        alt={client.name} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{client.name}</div>
                    <div className="text-sm opacity-50">{client.goal || 'No goal set'}</div>
                  </div>
                </div>
              </td>
              <td>{client.workouts?.length || 0}</td>
              <td>{client.nutritionPlans?.length || 0}</td>
              <td>{client.lastActive ? new Date(client.lastActive).toLocaleDateString() : 'Never'}</td>
              <td>
                <Link 
                  to={`/trainer/clients/${client.id}`} 
                  className="btn btn-sm btn-primary"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length > 5 && (
        <div className="mt-4 text-center">
          <Link to="/trainer/clients" className="btn btn-outline btn-sm">
            View All Clients
          </Link>
        </div>
      )}
    </div>
  );
};
