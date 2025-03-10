import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookAppointment, cancelAppointment, getAppointment } from '../../services/userServices';
import { setAppointmentR } from '../../redux/features/userSlice';

export const AppointmentUse = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Regular');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Time slots for selection
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Appointment types
  const appointmentTypes = [
    'Regular', 'Follow-up', 'Assessment', 'Consultation'
  ];
  console.log("user .... ",user);

  useEffect(() => {

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAppointment();

      console.log("Get Appointment response : ",response);

      dispatch(setAppointmentR(response.data.data))
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    console.log("bookingggg");
    
    e.preventDefault();
    
    if (!startTime || !endTime) {
      return toast.error('Please select start and end times');
    }

    if (startTime >= endTime) {
      return toast.error('End time must be after start time');
    }

    try {
      setLoading(true);
   
      
      const response = await bookAppointment({
        trainerId: user.trainerId,
        date: format(bookingDate, 'yyyy-MM-dd'),
        startTime,
        endTime,
        type: appointmentType,
        notes
      })
      

      console.log("Book Appointment response : ",response);

      toast.success('Appointment booked successfully!');
      fetchAppointments();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setLoading(true);
      
      const response=await cancelAppointment(selectedAppointment._id,{
        status: 'Cancelled',
        cancellationReason
      })

      console.log("Cancel appointment response : ",response);
      

      toast.success('Appointment cancelled successfully');
      setCancelModalOpen(false);
      setSelectedAppointment(null);
      setCancellationReason('');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookingDate(new Date());
    setStartTime('');
    setEndTime('');
    setAppointmentType('Regular');
    setNotes('');
  };

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  const getUpcomingAppointments = () => {
    return appointments.filter(apt => 
      (apt.status === 'Pending' || apt.status === 'Confirmed') && 
      isAfter(new Date(apt.date), new Date())
    );
  };

  const getPastAppointments = () => {
    return appointments.filter(apt => 
      apt.status === 'Completed' || 
      isBefore(new Date(apt.date), new Date())
    );
  };

  const getCancelledAppointments = () => {
    return appointments.filter(apt => apt.status === 'Cancelled');
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending': return 'badge-warning';
      case 'Confirmed': return 'badge-info';
      case 'Completed': return 'badge-success';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  // Filter appointments based on active tab
  const filteredAppointments = activeTab === 'upcoming' 
    ? getUpcomingAppointments()
    : activeTab === 'past' 
      ? getPastAppointments()
      : getCancelledAppointments();


      useEffect(()=>{
        console.log("Modal open");
        
      },[modalOpen])

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your fitness training sessions</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="btn btn-primary mt-4 md:mt-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </a>
        <a 
          className={`tab ${activeTab === 'past' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </a>
        <a 
          className={`tab ${activeTab === 'cancelled' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </a>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center my-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-semibold">No appointments found</h2>
            <p className="text-gray-500 mt-2">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming appointments. Book one now!" 
                : activeTab === 'past' 
                  ? "You don't have any past appointments."
                  : "You don't have any cancelled appointments."
              }
            </p>
            {activeTab === 'upcoming' && (
              <button 
                className="btn btn-primary mt-4"
                onClick={() => setModalOpen(true)}
              >
                Book Appointment
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{appointment.type} Session</h2>
                  <div className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                    {appointment.status}
                  </div>
                </div>
                
                <div className="my-4">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{format(new Date(appointment.date), 'EEEE, MMMM do, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{appointment.startTime} - {appointment.endTime}</span>
                  </div>
                  
                  {appointment.trainer && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{appointment.trainer.name}</span>
                    </div>
                  )}
                </div>
                
                {appointment.notes && (
                  <div className="mt-2 bg-base-200 p-3 rounded-lg">
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}
                
                {activeTab === 'upcoming' && appointment.status !== 'Cancelled' && (
                  <div className="card-actions justify-end mt-4">
                    <button 
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => openCancelModal(appointment)}
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

      {/* Book Appointment Modal */}
      {modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
      <h3 className="font-bold text-lg mb-4 text-black">Book New Appointment</h3>
      
      <form onSubmit={handleBookAppointment}>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-black">Select Date</span>
          </label>
          <DatePicker
            selected={bookingDate}
            onChange={(date) => setBookingDate(date)}
            minDate={new Date()}
            className="input input-bordered w-full"
            dateFormat="MMMM d, yyyy"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Start Time</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            >
              <option value="" disabled>Select time</option>
              {timeSlots.map((time) => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">End Time</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            >
              <option value="" disabled>Select time</option>
              {timeSlots.map((time) => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-black">Session Type</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
          >
            {appointmentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-black">Additional Notes</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-24"
            placeholder="Add any special requirements or notes for your trainer"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        
        <div className="modal-action">
          <button 
            type="button"
            className="btn btn-ghost"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 
              <span className="loading loading-spinner loading-sm"></span> : 
              'Book Appointment'
            }
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Cancel Appointment Modal */}
      {cancelModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Cancel Appointment</h3>
            <p className="py-4">Are you sure you want to cancel your {selectedAppointment.type} session on {format(new Date(selectedAppointment.date), 'MMMM do')}?</p>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Reason for cancellation</span>
              </label>
              <textarea 
                className="textarea textarea-bordered"
                placeholder="Please provide a reason for cancellation"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              ></textarea>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setCancelModalOpen(false);
                  setSelectedAppointment(null);
                }}
              >
                Keep Appointment
              </button>
              <button 
                className="btn btn-error"
                onClick={handleCancelAppointment}
                disabled={loading}
              >
                {loading ? 
                  <span className="loading loading-spinner loading-sm"></span> : 
                  'Cancel Appointment'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO, isAfter, isBefore, addMonths, isSameDay } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookAppointment, cancelAppointment, getTrainerAvailability, getUserAppointments } from '../../services/userServices';
import { setAppointmentR } from '../../redux/features/userSlice';


export const AppointmentUserPag = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Regular');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  
  
  const [trainerAvailability, setTrainerAvailability] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [highlightDates, setHighlightDates] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Time slots for selection
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Appointment types
  const appointmentTypes = [
    'Regular', 'Follow-up', 'Assessment', 'Consultation'
  ];

  useEffect(() => {
    fetchAppointments();
    console.log("user :",user);
    // console.log("user.tainerId : ",user.trainerId);
    
    if (user?.trainerId) {

      
      fetchTrainerAvailability();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getUserAppointments();
      console.log("Get Appointment response : ", response);
      dispatch(setAppointmentR(response.data.data));
      setAppointments(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerAvailability = async () => {
    
    setCalendarLoading(true);
    try {
      const response = await getTrainerAvailability(user.trainerId);
      // console.log("Trainer avilability response :",response.data.data);
      let data= response.data.data;

      if (typeof data.weeklySchedule === "string") {
        data.weeklySchedule = JSON.parse(data.weeklySchedule);
      }
      
      console.log("Trainer availability response:", data);
      setTrainerAvailability(data);
      
      
      // Process data for the calendar
      processAvailabilityForCalendar(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch trainer availability');
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated trainerAvailability in state :", trainerAvailability);
  }, [trainerAvailability]);

  // Process the availability data for the calendar
  const processAvailabilityForCalendar = (availabilityData) => {
    const { weeklySchedule, bookedSlots } = availabilityData;
    
    // Generate dates for the next 3 months
    const today = new Date();
    const futureDate = addMonths(today, 3);
    const availableDates = [];
    
    let currentDate = today;
    while (currentDate <= futureDate) {
      const dayName = [
        "Sunday", "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday"
      ][currentDate.getDay()];
      
      // Check if trainer works on this day
      const daySchedule = weeklySchedule.find(schedule => schedule.day === dayName);
      
      if (daySchedule && daySchedule.slots.some(slot => !slot.isBooked)) {
        // Check if all slots for this day are already booked in appointments
        const dateString = format(currentDate, 'yyyy-MM-dd');
        const dayBookings = bookedSlots.filter(slot => 
          format(new Date(slot.date), 'yyyy-MM-dd') === dateString
        );
        
        // If there are available slots, add this date
        if (daySchedule.slots.length > dayBookings.length) {
          availableDates.push(new Date(currentDate));
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setHighlightDates(availableDates);
  };

  // Update available time slots when date changes
  useEffect(() => {
    if (bookingDate && trainerAvailability) {
      updateAvailableTimeSlots();
    }
  }, [bookingDate, trainerAvailability]);

  const updateAvailableTimeSlots = () => {
    if (!trainerAvailability) return;
    
    const { weeklySchedule, bookedSlots } = trainerAvailability;
    const dayName = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ][bookingDate.getDay()];
    
    // Find the day's schedule
    const daySchedule = weeklySchedule.find(schedule => schedule.day === dayName);
    if (!daySchedule) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Get bookings for this specific date
    const dateString = format(bookingDate, 'yyyy-MM-dd');
    const dayBookings = bookedSlots.filter(slot => 
      format(new Date(slot.date), 'yyyy-MM-dd') === dateString
    );
    
    // Filter out booked slots
    const availableSlots = daySchedule.slots.filter(slot => {
      // Skip if marked as booked in the trainer's schedule
      if (slot.isBooked) return false;
      
      // Skip if there's an appointment at this time
      return !dayBookings.some(
        booking => booking.startTime === slot.startTime && booking.endTime === slot.endTime
      );
    });
    
    setAvailableTimeSlots(availableSlots);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      return toast.error('Please select start and end times');
    }

    if (startTime >= endTime) {
      return toast.error('End time must be after start time');
    }

    try {
      setLoading(true);
      const response = await bookAppointment({
        trainerId: user.trainerId,
        date: format(bookingDate, 'yyyy-MM-dd'),
        startTime,
        endTime,
        type: appointmentType,
        notes
      });
      
      console.log("BookAppointment response : ", response);
      toast.success('Appointment booked successfully!');
      fetchAppointments();
      fetchTrainerAvailability(); // Refresh availability after booking
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setLoading(true);
      
      const response = await cancelAppointment(selectedAppointment._id, {
        status: 'Cancelled',
        cancellationReason
      });

      console.log("Cancel appointment response : ", response);
      toast.success('Appointment cancelled successfully');
      setCancelModalOpen(false);
      setSelectedAppointment(null);
      setCancellationReason('');
      fetchAppointments();
      fetchTrainerAvailability(); // Refresh availability after cancellation
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookingDate(new Date());
    setStartTime('');
    setEndTime('');
    setAppointmentType('Regular');
    setNotes('');
  };

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  // Helper function to check if a date is in the highlighted dates array
  const isDateHighlighted = (date) => {
    return highlightDates.some(highlightDate => 
      isSameDay(date, highlightDate)
    );
  };

  // Custom day renderer for DatePicker
  const renderDayContents = (day, date) => {
    const isAvailable = isDateHighlighted(date);
    return (
      <div className={`text-center ${isAvailable ? 'font-bold' : 'text-gray-400'}`}>
        {day}
      </div>
    );
  };

  // Get appointments based on tab
  const getUpcomingAppointments = () => {
    return appointments.filter(apt => 
      (apt.status === 'Pending' || apt.status === 'Confirmed') && 
      isAfter(new Date(apt.date), new Date())
    );
  };

  const getPastAppointments = () => {
    return appointments.filter(apt => 
      apt.status === 'Completed' || 
      isBefore(new Date(apt.date), new Date())
    );
  };

  const getCancelledAppointments = () => {
    return appointments.filter(apt => apt.status === 'Cancelled');
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending': return 'badge-warning';
      case 'Confirmed': return 'badge-info';
      case 'Completed': return 'badge-success';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  // Filter appointments based on active tab
  const filteredAppointments = activeTab === 'upcoming' 
    ? getUpcomingAppointments()
    : activeTab === 'past' 
      ? getPastAppointments()
      : getCancelledAppointments();

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your fitness training sessions</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="btn btn-primary mt-4 md:mt-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </a>
        <a 
          className={`tab ${activeTab === 'past' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </a>
        <a 
          className={`tab ${activeTab === 'cancelled' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </a>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center my-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-semibold">No appointments found</h2>
            <p className="text-gray-500 mt-2">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming appointments. Book one now!" 
                : activeTab === 'past' 
                  ? "You don't have any past appointments."
                  : "You don't have any cancelled appointments."
              }
            </p>
            {activeTab === 'upcoming' && (
              <button 
                className="btn btn-primary mt-4"
                onClick={() => setModalOpen(true)}
              >
                Book Appointment
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{appointment.type} Session</h2>
                  <div className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                    {appointment.status}
                  </div>
                </div>
                
                <div className="my-4">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{format(new Date(appointment.date), 'EEEE, MMMM do, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{appointment.startTime} - {appointment.endTime}</span>
                  </div>
                  
                  {appointment.trainer && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{appointment.trainer.name}</span>
                    </div>
                  )}
                </div>
                
                {appointment.notes && (
                  <div className="mt-2 bg-base-200 p-3 rounded-lg">
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}
                
                {activeTab === 'upcoming' && appointment.status !== 'Cancelled' && (
                  <div className="card-actions justify-end mt-4">
                    <button 
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => openCancelModal(appointment)}
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

      {/* Book Appointment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-black">Book New Appointment</h3>
            
            <form onSubmit={handleBookAppointment}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-black">Select Date (Available dates are highlighted)</span>
                </label>
                {calendarLoading ? (
                  <div className="flex justify-center my-2">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  </div>
                ) : (
                  <DatePicker
                    selected={bookingDate}
                    onChange={(date) => setBookingDate(date)}
                    minDate={new Date()}
                    highlightDates={highlightDates}
                    filterDate={isDateHighlighted}
                    renderDayContents={renderDayContents}
                    className="input input-bordered w-full"
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select an available date"
                  />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black">Start Time</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      // Automatically set end time to next slot if not set
                      if (!endTime) {
                        const startIndex = availableTimeSlots.findIndex(slot => slot.startTime === e.target.value);
                        if (startIndex >= 0 && startIndex < availableTimeSlots.length - 1) {
                          setEndTime(availableTimeSlots[startIndex + 1].startTime);
                        }
                      }
                    }}
                    required
                    disabled={availableTimeSlots.length === 0}
                  >
                    <option value="" disabled>Select time</option>
                    {availableTimeSlots.map((slot) => (
                      <option key={`start-${slot.startTime}`} value={slot.startTime}>
                        {slot.startTime}
                      </option>
                    ))}
                  </select>
                  {availableTimeSlots.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">No available time slots for this date</p>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black">End Time</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    disabled={!startTime || availableTimeSlots.length === 0}
                  >
                    <option value="" disabled>Select time</option>
                    {availableTimeSlots
                      .filter(slot => slot.startTime > startTime)
                      .map((slot) => (
                        <option key={`end-${slot.startTime}`} value={slot.startTime}>
                          {slot.startTime}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-black">Session Type</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >
                  {appointmentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-black">Additional Notes</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24"
                  placeholder="Add any special requirements or notes for your trainer"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              
              <div className="modal-action">
                <button 
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !startTime || !endTime}
                >
                  {loading ? 
                    <span className="loading loading-spinner loading-sm"></span> : 
                    'Book Appointment'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {cancelModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
            <h3 className="font-bold text-lg text-black">Cancel Appointment</h3>
            <p className="py-4 text-black">Are you sure you want to cancel your {selectedAppointment.type} session on {format(new Date(selectedAppointment.date), 'MMMM do')}?</p>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Reason for cancellation</span>
              </label>
              <textarea 
                className="textarea textarea-bordered"
                placeholder="Please provide a reason for cancellation"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              ></textarea>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setCancelModalOpen(false);
                  setSelectedAppointment(null);
                }}
              >
                Keep Appointment
              </button>
              <button 
                className="btn btn-error"
                onClick={handleCancelAppointment}
                disabled={loading}
              >
                {loading ? 
                  <span className="loading loading-spinner loading-sm"></span> : 
                  'Cancel Appointment'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};