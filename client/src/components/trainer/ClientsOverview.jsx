import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertError } from '../shared/AlertError';

export const ClientsOverview = ({ clients }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  if (!clients || clients.length === 0) {
    return <AlertError error={"No clients yet"} />;
  }
  console.log("CLIENTS : ", clients);
  
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
          {sortedClients.slice(0, 5).map((client,index) => (
            <tr key={client.id || index}>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-10 h-10">
                      <img 
                        src={client.image || '/avatar-placeholder.png'} 
                        alt={client.name} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{client.name}</div>
                    <div className="text-sm opacity-50">{client.fitnessGoal || 'No goal set'}</div>
                  </div>
                </div>
              </td>
              <td>{client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : 'Never'}</td>
              <td>
                <Link 
                  to={`/trainer/clients`} 
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
