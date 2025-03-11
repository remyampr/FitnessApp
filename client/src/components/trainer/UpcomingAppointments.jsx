// components/trainer/dashboard/UpcomingAppointments.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const UpcomingAppointments = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  console.log("Appointments in Upcoming appointment component : ",appointments);
  
  
  if (!appointments || appointments.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Upcoming Appointments</h2>
          <div className="alert alert-info">
            <div>
              <span>No upcoming appointments scheduled.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const handleStatusUpdate = async (appointmentId, status) => {
    console.log("STATUS : ",status)
    try {
     

      setSelectedAppointment(prev => prev ? { ...prev, status } : null);
 
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };
  
  const handleNoteAdd = async (appointmentId, note) => {
    try {
      // This would be an API call to add a note to the appointment
      // await api.post(`/appointments/${appointmentId}/notes`, { note });
      
      // Close the modal after adding the note
      setSelectedAppointment(null);
      
      // You would typically refresh the appointments list after this
    } catch (error) {
      console.error('Error adding appointment note:', error);
    }
  };


  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge badge-primary">Confirmed</span>;
      case 'Pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'Completed':
        return <span className="badge badge-success">Completed</span>;
      case 'Cancelled':
        return <span className="badge badge-error">Cancelled</span>;
      case 'no-show':
        return <span className="badge badge-warning">No Show</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  appointments.map((apt)=> (console.log("APT ::",apt,apt._id)))
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Upcoming Appointments</h2>
          <Link to="/trainer/appointments" className="btn btn-sm btn-outline">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
             
              </tr>
            </thead>
            <tbody>
              {appointments?.map((appointment,index) => (
                               
                <tr key={appointment?._id || index}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10">
                          <img
                            src={appointment.user?.image || '/avatar-placeholder.png'}
                            alt={appointment.user?.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{appointment.user?.name}</div>
                        <div className="text-sm opacity-50">{appointment.type || 'Session'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{(appointment.startTime)}</td>
                  <td>{getStatusBadge(appointment.status)}</td>
                  {/* <td>
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="btn btn-sm btn-primary"
                    >
                      Manage
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold">Appointment Details</h3>
            
            <div className="py-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img
                      src={selectedAppointment.client?.avatar || '/avatar-placeholder.png'}
                      alt={selectedAppointment.client?.name}
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-lg">{selectedAppointment.client?.name}</div>
                  <div className="text-sm">{selectedAppointment.client?.email}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm opacity-70">Date</div>
                  <div>{formatDate(selectedAppointment.date)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Time</div>
                  <div>{formatTime(selectedAppointment.date)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Type</div>
                  <div>{selectedAppointment.type || 'Session'}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Status</div>
                  <div>{getStatusBadge(selectedAppointment.status)}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm opacity-70 mb-1">Notes</div>
                <textarea 
                  className="textarea textarea-bordered w-full" 
                  placeholder="Add notes about this appointment"
                  defaultValue={selectedAppointment.notes}
                  id="appointmentNotes"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="divider">Update Status</div>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => handleStatusUpdate(selectedAppointment.id, 'scheduled')}
                  disabled={selectedAppointment.status === 'scheduled'}
                >
                  Scheduled
                </button>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => handleStatusUpdate(selectedAppointment.id, 'completed')}
                  disabled={selectedAppointment.status === 'completed'}
                >
                  Completed
                </button>
                <button 
                  className="btn btn-warning btn-sm"
                  onClick={() => handleStatusUpdate(selectedAppointment.id, 'no-show')}
                  disabled={selectedAppointment.status === 'no-show'}
                >
                  No Show
                </button>
                <button 
                  className="btn btn-error btn-sm"
                  onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                  disabled={selectedAppointment.status === 'cancelled'}
                >
                  Cancelled
                </button>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                onClick={() => {
                  const notes = document.getElementById('appointmentNotes').value;
                  handleNoteAdd(selectedAppointment.id, notes);
                }}
                className="btn btn-primary"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

