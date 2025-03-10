import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

// Trainer appointment actions
const fetchTrainerAppointments = () => async (dispatch) => {
  dispatch({ type: 'trainer/appointmentsLoading' });
  try {
    const response = await axios.get('/api/appointments/trainer');
    dispatch({ 
      type: 'trainer/appointmentsLoaded', 
      payload: response.data.data 
    });
  } catch (error) {
    dispatch({ 
      type: 'trainer/appointmentsError', 
      payload: error.response?.data?.message || 'Failed to load appointments' 
    });
    toast.error(error.response?.data?.message || 'Failed to load appointments');
  }
};

const updateAppointmentStatus = (appointmentId, statusData) => async (dispatch) => {
  dispatch({ type: 'trainer/appointmentUpdating', payload: appointmentId });
  try {
    const response = await axios.patch(`/api/appointments/${appointmentId}/status`, statusData);
    dispatch({ 
      type: 'trainer/appointmentUpdated', 
      payload: response.data.data 
    });
    toast.success(`Appointment ${statusData.status.toLowerCase()} successfully`);
    return response.data;
  } catch (error) {
    dispatch({ 
      type: 'trainer/appointmentUpdateError', 
      payload: { id: appointmentId, error: error.response?.data?.message || 'Update failed' } 
    });
    toast.error(error.response?.data?.message || 'Failed to update appointment');
    throw error;
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let badgeClass = 'badge ';
  
  switch (status) {
    case 'Pending':
      badgeClass += 'badge-warning';
      break;
    case 'Confirmed':
      badgeClass += 'badge-primary';
      break;
    case 'Completed':
      badgeClass += 'badge-success';
      break;
    case 'Cancelled':
      badgeClass += 'badge-error';
      break;
    default:
      badgeClass += 'badge-ghost';
  }
  
  return <span className={badgeClass}>{status}</span>;
};

// Appointment Details Modal
const AppointmentDetailsModal = ({ appointment, onClose, onUpdateStatus }) => {
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!appointment) return null;
  
  const handleStatusUpdate = async (status) => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(appointment._id, { status, notes });
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Appointment Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-2">Client Information</h4>
            <p><span className="font-medium">Name:</span> {appointment.user?.name}</p>
            <p><span className="font-medium">Email:</span> {appointment.user?.email}</p>
            <p><span className="font-medium">Fitness Goal:</span> {appointment.user?.finessGoal || 'Not specified'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Appointment Information</h4>
            <p><span className="font-medium">Date:</span> {format(new Date(appointment.date), 'MMMM d, yyyy')}</p>
            <p><span className="font-medium">Time:</span> {appointment.startTime} - {appointment.endTime}</p>
            <p><span className="font-medium">Status:</span> <StatusBadge status={appointment.status} /></p>
            <p><span className="font-medium">Booked via:</span> {appointment.bookingSource}</p>
          </div>
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium">Notes</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-24" 
            placeholder="Add notes about this appointment"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        
        {appointment.status === 'Pending' && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              className="btn btn-primary" 
              onClick={() => handleStatusUpdate('Confirmed')}
              disabled={isSubmitting}
            >
              Confirm Appointment
            </button>
            <button 
              className="btn btn-error" 
              onClick={() => handleStatusUpdate('Cancelled')}
              disabled={isSubmitting}
            >
              Cancel Appointment
            </button>
          </div>
        )}
        
        {appointment.status === 'Confirmed' && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              className="btn btn-success" 
              onClick={() => handleStatusUpdate('Completed')}
              disabled={isSubmitting}
            >
              Mark as Completed
            </button>
            <button 
              className="btn btn-error" 
              onClick={() => handleStatusUpdate('Cancelled')}
              disabled={isSubmitting}
            >
              Cancel Appointment
            </button>
          </div>
        )}
        
        {appointment.cancellationReason && (
          <div className="alert alert-error mb-4">
            <div>
              <span className="font-bold">Cancellation Reason:</span> {appointment.cancellationReason}
            </div>
          </div>
        )}
        
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Main Appointments Component
export const  TrainerAppointmentsPage = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.trainer);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  useEffect(() => {
    dispatch(fetchTrainerAppointments());
  }, [dispatch]);
  
  const handleStatusUpdate = (appointmentId, statusData) => {
    return dispatch(updateAppointmentStatus(appointmentId, statusData));
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }
  
  if (error && !appointments?.length) {
    return (
      <div className="alert alert-error">
        <div>
          <span>Error loading appointments. Please try again later.</span>
        </div>
      </div>
    );
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value">{appointments?.length || 0}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div className="stat-title">Pending</div>
          <div className="stat-value">{appointments?.filter(a => a.status === 'Pending').length || 0}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Confirmed</div>
          <div className="stat-value">{appointments?.filter(a => a.status === 'Confirmed').length || 0}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div className="stat-title">Completed</div>
          <div className="stat-value">{appointments?.filter(a => a.status === 'Completed').length || 0}</div>
        </div>
      </div>
      
      {/* No appointments message */}
      {(!filteredAppointments || filteredAppointments.length === 0) && (
        <div className="bg-base-100 p-8 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
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

// Add to your redux trainerSlice
const trainerSliceAppointments = {
  // Initial state
  initialState: {
    appointments: [],
    loading: false,
    error: null,
    updatingAppointments: []
  },
  
  // Reducers
  reducers: {
    appointmentsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    appointmentsLoaded: (state, action) => {
      state.appointments = action.payload;
      state.loading = false;
    },
    appointmentsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    appointmentUpdating: (state, action) => {
      state.updatingAppointments.push(action.payload);
    },
    appointmentUpdated: (state, action) => {
      const updatedAppointment = action.payload;
      state.appointments = state.appointments.map(appointment => 
        appointment._id === updatedAppointment._id ? updatedAppointment : appointment
      );
      state.updatingAppointments = state.updatingAppointments.filter(id => id !== updatedAppointment._id);
    },
    appointmentUpdateError: (state, action) => {
      state.updatingAppointments = state.updatingAppointments.filter(id => id !== action.payload.id);
    }
  }
};

