import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, Check, CheckCircle, Plus } from "lucide-react";
import { toast } from 'react-toastify';
import { updateAppointments } from '../../redux/features/trainerSlice';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { AlertError } from '../../components/shared/AlertError';
import { updateAppointment } from '../../services/trainerServices';
import { AppointmentDetailsModal } from '../../components/trainer/AppointmentModal';



export const  TrainerAppointmentsPage = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.trainer);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  

  
// console.log("Appoinments in redux at appointment page -> : ",appointments);


  const handleStatusUpdate = async(appointmentId, statusData) => {
    // console.log("updating details : ",appointmentId,statusData);
    
    const upadteAptResp=await updateAppointment(appointmentId, statusData);
    // console.log("after updating ",upadteAptResp);
      
    return dispatch(updateAppointments(appointmentId, statusData));
  };
  
  // Filter appointments based on selected filters
  const filteredAppointments = appointments?.filter(appointment => {
    // Filter by status
    if (filteredStatus !== 'all' && appointment.status !== filteredStatus) {
      return false;
    }
    
    // Filter by search query (client name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const userName = appointment.user?.name?.toLowerCase() || '';
      const userEmail = appointment.user?.email?.toLowerCase() || '';
      
      if (!userName.includes(query) && !userEmail.includes(query)) {
        return false;
      }
    }
    
    // Filter by date
    if (dateFilter) {
      const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
      if (appointmentDate !== dateFilter) {
        return false;
      }
    }
    
    return true;
  });
  
  const groupAppointmentsByDate = (appointments) => {
    const grouped = {};
    
    appointments?.forEach(appointment => {
      const date = new Date(appointment.date).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
    });
    
    // Sort dates in descending order (newest first)
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        date,
        appointments: grouped[date].sort((a, b) => {
          // Sort by time for the same date
          return a.startTime.localeCompare(b.startTime);
        })
      }));
  };
  
  const groupedAppointments = groupAppointmentsByDate(filteredAppointments);
  
  if (loading && !appointments?.length) {
    return <LoadingSpinner/>
  
  }
  
  if (error && !appointments?.length) {
    return  <AlertError error={"Error loading appointments. Please try again later."} />

  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      
      {/* Filters */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search Client</span>
            </label>
            <input 
              type="text" 
              placeholder="Search by name or email" 
              className="input input-bordered w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Filter by Status</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={filteredStatus}
              onChange={(e) => setFilteredStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Filter by Date</span>
            </label>
            <input 
              type="date" 
              className="input input-bordered w-full" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => {
              setFilteredStatus('all');
              setSearchQuery('');
              setDateFilter('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
          <Plus className="w-8 h-8 text-current" />
          </div>
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value">{appointments?.length || 0}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-warning">
       
<AlertTriangle className="w-8 h-8 text-current" />
          </div>
          <div className="stat-title">Pending</div>
          <div className="stat-value">{appointments?.filter(a => a.status === 'Pending').length || 0}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-primary">
          <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="stat-title">Confirmed</div>
          <div className="stat-value">{appointments?.filter(a => a.status === 'Confirmed').length || 0}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-success">
          <Check className="w-8 h-8 text-green-500" />
          </div>
          <div className="stat-title">Completed</div>
          <div className="stat-value">{appointments?.filter(a => a.status === 'Completed').length || 0}</div>
        </div>
      </div>
      
      {/* No appointments message */}
      {(!filteredAppointments || filteredAppointments.length === 0) && (
        <div className="bg-base-100 p-8 rounded-lg shadow text-center">
       <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">No appointments found</h2>
          <p className="text-gray-500">
            {filteredStatus !== 'all' || searchQuery || dateFilter 
              ? 'Try changing your filters to see more appointments' 
              : 'When clients book appointments, they will appear here'}
          </p>
          {(filteredStatus !== 'all' || searchQuery || dateFilter) && (
            <button 
              className="btn btn-primary mt-4"
              onClick={() => {
                setFilteredStatus('all');
                setSearchQuery('');
                setDateFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
      
      {/* Appointments list */}
      {groupedAppointments.map(group => (
        <div key={group.date} className="mb-8">
          <h2 className="text-lg font-bold mb-4 bg-base-200 p-2 rounded">
            {format(new Date(group.date), 'EEEE, MMMM d, yyyy')}
            <span className="text-sm text-gray-500 ml-2">
              ({group.appointments.length} appointment{group.appointments.length !== 1 ? 's' : ''})
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.appointments.map(appointment => (
              <div 
                key={appointment._id} 
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title text-lg">{appointment.user?.name || 'Client'}</h3>
                    <StatusBadge status={appointment.status} />
                  </div>
                  
                  <div className="text-sm mt-2">
                    <p className="mb-1">
                      <span className="font-medium">Time:</span> {appointment.startTime} - {appointment.endTime}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Email:</span> {appointment.user?.email}
                    </p>
                    {appointment.notes && (
                      <p className="mb-1">
                        <span className="font-medium">Notes:</span> 
                        <span className="truncate block">{appointment.notes}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="card-actions justify-end mt-2">
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(appointment);
                      }}
                    >
                      View Details
                    </button>
                    
                    {appointment.status === 'Pending' && (
                      <>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(appointment._id, { status: 'Confirmed' });
                          }}
                        >
                          Confirm
                        </button>
                        <button 
                          className="btn btn-sm btn-error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(appointment._id, { status: 'Cancelled' });
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {selectedAppointment && (
        <AppointmentDetailsModal 
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
};

;

