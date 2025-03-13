import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isToday, isPast, parseISO, isSameDay } from "date-fns";
import {
  bookAppointment,
  cancelAppointment,
  getTrainerAvailability,
  getUserAppointments,
} from "../../services/userServices";
import { AlertError } from "../../components/shared/AlertError";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export const UserAppointmentPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingType, setBookingType] = useState("");
  const [notes, setNotes] = useState("");
  const [trainerAvailability, setTrainerAvailability] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  const { user } = useSelector((state) => state.user.user);
  const trainer = user?.trainerId;
  const trainerId = trainer?._id;
  // console.log("user : ",user);
  // console.log("trainer: ",trainer);
  // console.log("trainerId : ",trainerId);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getUserAppointments();
      console.log("GetUserAppointments response : ", response);

      setAppointments(response.data.data);
      filterAppointments(response.data.data, activeTab);
      setLoading(false);
    } catch (err) {
      setError("Failed to load appointments");
      setLoading(false);
      console.error(err);
    }
  };

  const fetchTrainerAvailability = async () => {
    try {
      console.log("Fetchingggg...");

      if (!trainerId) return;

      const response = await getTrainerAvailability(trainerId);
      console.log("trainerAvilabilityResponse : ", response);

      if (response.data && response.data.data) {
        setTrainerAvailability(response.data.data);

        // Process available days
        const availableDays = response.data.data.weeklySchedule.map(
          (day) => day.day
        );
        setAvailableDates(availableDays);
      } else {
        console.error("Trainer availability data is missing");
      }
    } catch (err) {
      console.error("Failed to load trainer availability:", err);
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
      case "upcoming":
        setFilteredAppointments(
          appointments.filter(
            (apt) =>
              !isPast(parseISO(apt.date)) &&
              apt.status !== "Cancelled" &&
              apt.status !== "Completed"
          )
        );
        break;
      case "past":
        setFilteredAppointments(
          appointments.filter(
            (apt) => isPast(parseISO(apt.date)) && apt.status !== "Cancelled"
          )
        );
        break;
      case "cancelled":
        setFilteredAppointments(
          appointments.filter((apt) => apt.status === "Cancelled")
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
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][date.getDay()];

    return availableDates.includes(dayName);
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date) => {
    if (!trainerAvailability) return [];

    const dayName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][date.getDay()];

    const daySchedule = trainerAvailability.weeklySchedule.find(
      (schedule) => schedule.day === dayName
    );

    if (!daySchedule) return [];

    return daySchedule.slots.filter((slot) => !slot.isBooked);

    // Filter out booked slots
    // const bookedSlotsForDay = trainerAvailability.bookedSlots.filter(
    //   slot => isSameDay(parseISO(slot.date), date)
    // );

    // return daySchedule.slots.filter(slot => {
    //   const isSlotBooked = bookedSlotsForDay.some(
    //     bookedSlot =>
    //       bookedSlot.startTime === slot.startTime &&
    //       bookedSlot.endTime === slot.endTime
    //   );
    //   return !isSlotBooked && !slot.isBooked;
    // });
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
      alert("Please select a time slot and appointment type");
      return;
    }

    try {
      const appointmentData = {
        trainerId: trainerId,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        type: bookingType,
        notes: notes,
      };

      const bookingResponse = await bookAppointment(appointmentData);

      console.log("Booking Response : ", bookingResponse);

      //
      setModalOpen(false);
      // Reset form
      setShowBookingForm(false);
      setSelectedDate(new Date());
      setSelectedTimeSlot(null);
      setBookingType("");
      setNotes("");

      // Refresh appointments
      fetchAppointments();
      fetchTrainerAvailability();
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      console.log("details for cancelation : id,",appointmentId);
      
      const cancelResponde = await cancelAppointment(appointmentId, {
        status: "Cancelled",
        cancellationReason: "User requested cancellation",
      });

      // Refresh appointments
      fetchAppointments();
      fetchTrainerAvailability();
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  // Format time for display
  const formatTime = (time) => {
    return time;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "badge-warning";
      case "Confirmed":
        return "badge-success";
      case "Completed":
        return "badge-info";
      case "Cancelled":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  // Calendar tile class
  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const classes = [];

      // Highlight today
      if (isToday(date)) {
        classes.push("bg-primary text-primary-content");
      }

      // Highlight available days
      if (isTrainerAvailableDay(date)) {
        classes.push("bg-success-content text-success-content");
      } else {
        classes.push("bg-base-300 text-base-content opacity-50");
      }

      return classes.join(" ");
    }
  };

  // Disable unavailable days
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      return !isTrainerAvailableDay(date) || isPast(date);
    }
  };

  return (
   
    <div className="flex min-h-screen">
<div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {!trainerId && (
        <AlertError
          error={
            "You need to be assigned a trainer before booking appointments."
          }
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab ${activeTab === "past" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
          <button
            className={`tab ${activeTab === "cancelled" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {trainerId && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary mt-4 md:mt-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Book New Appointment
          </button>
          // <button
          //   className="btn btn-primary"
          //   onClick={() => setShowBookingForm(true)}
          //   disabled={!trainerId}
          // >
          //   Book Appointment
          // </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <AlertError error={error} />
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">
            No {activeTab} appointments found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex justify-between">
                  <span>{appointment.type}</span>
                  <span
                    className={`badge ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>
                </h2>
                <div className="my-2">
                  <p>
                    <strong>Date:</strong>{" "}
                    {format(parseISO(appointment.date), "MMMM dd, yyyy")}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(appointment.startTime)} -{" "}
                    {formatTime(appointment.endTime)}
                  </p>
                  {appointment.notes && (
                    <p>
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  )}
                  {appointment.cancellationReason && (
                    <p>
                      <strong>Cancellation Reason:</strong>{" "}
                      {appointment.cancellationReason}
                    </p>
                  )}
                </div>
                {appointment.status !== "Cancelled" &&
                  appointment.status !== "Completed" &&
                  !isPast(parseISO(appointment.date)) && (
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

        {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-black">
              Book New Appointment
            </h3>

            <>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-black">Select Date</span>
                </label>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileClassName={getTileClassName}
                  tileDisabled={tileDisabled}
                  className="rounded-lg overflow-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <label className="block mb-2 font-medium">
                  Available Time Slots
                </label>
                {availableTimeSlots.length === 0 ? (
                  <p className="text-error">
                    No available time slots for this date
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`btn ${
                          selectedTimeSlot === slot
                            ? "btn-primary"
                            : "btn-outline"
                        }`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className=" mt-4">
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

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-black">
                    Additional Notes
                  </span>
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
                  onClick={handleBookAppointment}
      disabled={!selectedTimeSlot || !bookingType}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Book Appointment"
                  )}

                </button>
              </div>
            </>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
