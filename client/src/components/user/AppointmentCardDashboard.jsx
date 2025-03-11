import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const AppointmentCardDashboard = ({ appointments }) => {
  const today = new Date();
  const navigate = useNavigate();

  const todayAppointments = appointments?.filter(
    (appointment) =>
      format(new Date(appointment.date), "yyyy-MM-dd") ===
      format(today, "yyyy-MM-dd")
  );

  return (
    <div className="card bg-blue-600 text-white shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Today's Appointments</h2>

        {todayAppointments && todayAppointments.length > 0 ? (
          todayAppointments.map((appointment) => (
            <div key={appointment._id} className="p-2 border-b border-blue-400">
              <p className="font-bold">Trainer: {appointment.trainer?.name}</p>
              <p>Status: {appointment.status}</p>
              <p>Start Time: {appointment.startTime}</p>
              {appointment.notes && <p>Notes: {appointment.notes}</p>}
            </div>
          ))
        ) : (
          <p>No appointments for today</p>
        )}

<button
  onClick={() => navigate("/user/appointments")}
  className=" btn btn-accent bg-blue-400 text-blue-900 mt-3 px-4 py-2 rounded-md 
             hover:bg-blue-500 hover:text-white transition duration-300"
>
  View All
</button>
      </div>
    </div>
  );
};
