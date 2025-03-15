import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { updateAppointments } from "../../redux/features/trainerSlice";
import { updateAppointment } from "../../services/trainerServices";
import { StatusBadge } from "../shared/StatusBadge";

export const AppointmentDetailsModal = ({ appointment, onClose, updatedAppointment }) => {
    const dispatch=useDispatch();
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!appointment) return null;
  
  const handleStatusUpdate = async (status) => {
    // console.log("updating details : ",appointment._id,status);
    setIsSubmitting(true);
    try {
      const aptUpdateResponse=await updateAppointment(appointment._id, { status, notes });
      // console.log("Appointment update res : ",aptUpdateResponse.data);
        
        dispatch(updateAppointments(aptUpdateResponse.data.data));
      
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error.response.data.message)
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
            <p><span className="font-medium">Fitness Goal:</span> {appointment.user?.fitnessGoal || 'Not specified'}</p>
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