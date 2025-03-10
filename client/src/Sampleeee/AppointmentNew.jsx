import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isToday, isPast, parseISO, isSameDay } from 'date-fns';
import { getUserAppointments } from '../../services/userServices';

export const UserAppointmentPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingType, setBookingType] = useState('');
  const [notes, setNotes] = useState('');
  const [trainerAvailability, setTrainerAvailability] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  const { user } = useSelector((state) => state.user);
  console.log("USER :",user);
  
  const trainerId = user?.trainerId;
  console.log("trainer Id : ",trainerId);
  

  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getUserAppointments();
      console.log("GetUserAppointments response : ",response,trainerId);
      console.log("trainer Id : ",trainerId);
      
      setAppointments(response.data.data);
      filterAppointments(response.data.data, activeTab);
      setLoading(false);
    } catch (err) {
      setError('Failed to load appointments');
      setLoading(false);
      console.error(err);
    }
  };

  // Fetch trainer availability
  const fetchTrainerAvailability = async () => {
    console.log("fetching");
    
    try {
      if (!trainerId) return;
      
      const response = await axios.get(`/api/trainers/${trainerId}/availability`);
      setTrainerAvailability(response.data.data);
      
      // Process available days
      const availableDays = response.data.data.weeklySchedule.map(day => day.day);
      setAvailableDates(availableDays);
    } catch (err) {
      console.error('Failed to load trainer availability:', err);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchAppointments();
    fetchTrainerAvailability();
  }, [trainerId]);

  // Filter appointments based on active tab
  const filterAppointments = (appointments, tabName) => {
    const now = new Date();
    
    switch (tabName) {
      case 'upcoming':
        setFilteredAppointments(
          appointments.filter(
            (apt) => 
              !isPast(parseISO(apt.date)) && 
              apt.status !== 'Cancelled' && 
              apt.status !== 'Completed'
          )
        );
        break;
      case 'past':
        setFilteredAppointments(
          appointments.filter(
            (apt) => 
              isPast(parseISO(apt.date)) && 
              apt.status !== 'Cancelled'
          )
        );
        break;
      case 'cancelled':
        setFilteredAppointments(
          appointments.filter((apt) => apt.status === 'Cancelled')
        );
        break;
      default:
        setFilteredAppointments(appointments);
    }
  };

  useEffect(() => {
    filterAppointments(appointments, activeTab);
  }, [activeTab, appointments]);

  // Check if a date is an available trainer day
  const isTrainerAvailableDay = (date) => {
    if (!trainerAvailability) return false;
    
    const dayName = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ][date.getDay()];
    
    return availableDates.includes(dayName);
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date) => {
    if (!trainerAvailability) return [];
    
    const dayName = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ][date.getDay()];
    
    const daySchedule = trainerAvailability.weeklySchedule.find(
      schedule => schedule.day === dayName
    );
    
    if (!daySchedule) return [];

    // Filter out booked slots
    const bookedSlotsForDay = trainerAvailability.bookedSlots.filter(
      slot => isSameDay(parseISO(slot.date), date)
    );

    return daySchedule.slots.filter(slot => {
      const isSlotBooked = bookedSlotsForDay.some(
        bookedSlot => 
          bookedSlot.startTime === slot.startTime && 
          bookedSlot.endTime === slot.endTime
      );
      return !isSlotBooked && !slot.isBooked;
    });
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const availableSlots = getAvailableTimeSlots(date);
    setAvailableTimeSlots(availableSlots);
    setSelectedTimeSlot(null);
  };

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!selectedTimeSlot || !bookingType) {
      alert('Please select a time slot and appointment type');
      return;
    }

    try {
      const appointmentData = {
        trainerId: trainerId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        type: bookingType,
        notes: notes,
      };

      await axios.post('/api/appointments', appointmentData);
      
      // Reset form
      setShowBookingForm(false);
      setSelectedDate(new Date());
      setSelectedTimeSlot(null);
      setBookingType('');
      setNotes('');
      
      // Refresh appointments
      fetchAppointments();
      fetchTrainerAvailability();
      
    } catch (err) {
      console.error('Error booking appointment:', err);
      alert('Failed to book appointment. Please try again.');
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await axios.put(`/api/appointments/user/${appointmentId}`, {
        status: 'Cancelled',
        cancellationReason: 'User requested cancellation'
      });
      
      // Refresh appointments
      fetchAppointments();
      fetchTrainerAvailability();
      
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  // Format time for display
  const formatTime = (time) => {
    return time; // The time is already formatted as per the model (e.g., "09:00 AM")
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'badge-warning';
      case 'Confirmed': return 'badge-success';
      case 'Completed': return 'badge-info';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  // Calendar tile class
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const classes = [];
      
      // Highlight today
      if (isToday(date)) {
        classes.push('bg-primary text-primary-content');
      }
      
      // Highlight available days
      if (isTrainerAvailableDay(date)) {
        classes.push('bg-success-content text-success-content');
      } else {
        classes.push('bg-base-300 text-base-content opacity-50');
      }
      
      return classes.join(' ');
    }
  };

  // Disable unavailable days
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return !isTrainerAvailableDay(date) || isPast(date);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      
      {!trainerId && (
        <div className="alert alert-warning mb-6">
          <div className="flex-1">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span>You need to be assigned a trainer before booking appointments.</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="tabs tabs-boxed">
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`tab ${activeTab === 'past' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          <button 
            className={`tab ${activeTab === 'cancelled' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
        
        {trainerId && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowBookingForm(true)}
            disabled={!trainerId}
          >
            Book Appointment
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <div className="flex-1">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No {activeTab} appointments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex justify-between">
                  <span>{appointment.type}</span>
                  <span className={`badge ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </h2>
                <div className="my-2">
                  <p><strong>Date:</strong> {format(parseISO(appointment.date), 'MMMM dd, yyyy')}</p>
                  <p><strong>Time:</strong> {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                  {appointment.cancellationReason && (
                    <p><strong>Cancellation Reason:</strong> {appointment.cancellationReason}</p>
                  )}
                </div>
                {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && !isPast(parseISO(appointment.date)) && (
                  <div className="card-actions justify-end">
                    <button 
                      className="btn btn-error btn-sm"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Book an Appointment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Select Date</label>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileClassName={getTileClassName}
                  tileDisabled={tileDisabled}
                  className="rounded-lg overflow-hidden"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Available Time Slots</label>
                {availableTimeSlots.length === 0 ? (
                  <p className="text-error">No available time slots for this date</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`btn ${selectedTimeSlot === slot ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="mt-4">
                  <label className="block mb-2 font-medium">Appointment Type</label>
                  <select 
                    className="select select-bordered w-full"
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                  >
                    <option value="">Select type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Training Session">Training Session</option>
                    <option value="Progress Review">Progress Review</option>
                    <option value="Diet Planning">Diet Planning</option>
                  </select>
                </div>
                
                <div className="mt-4">
                  <label className="block mb-2 font-medium">Notes (optional)</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific details about this appointment..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleBookAppointment}
                disabled={!selectedTimeSlot || !bookingType}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};













