import React from "react";
import { useSelector } from "react-redux";

export const RecentActivity = () => {
  const { recentActivity } = useSelector((state) => state.admin.dashboardStats);

  console.log("ACTIVITYYY: ", recentActivity);

  // Combine all types of activities into a single array
  const allActivities = [
    ...recentActivity.lastUsers.map((user) => ({
      type: "User",
      badge: "badge-info",
      description: user.action || "User activity",
      user: user.details.email,
      date: new Date(user.timestamp),
      rawDate: user.timestamp,
    })),
    ...recentActivity.lastTrainers.map((trainer) => ({
      type: "Trainer",
      badge: "badge-primary",
      description: trainer.action || "Trainer activity",
      user: trainer.email,
      date: new Date(trainer.timestamp),
      rawDate: trainer.timestamp,
    })),
    ...recentActivity.recentPayments.map((payment) => ({
      type: "Payment",
      badge: "badge-success",
      description: `Payment of ${payment.amount}`,
      user: payment.user,
      date: new Date(payment.timestamp),
      rawDate: payment.timestamp,
    })),
    ...recentActivity.lastAppointments.map((appointment) => ({
      type: "Appointment",
      badge: "badge-warning",
      description: appointment.status || "Appointment updated",
      user: appointment.client,
      date: new Date(appointment.timestamp),
      rawDate: appointment.timestamp,
    })),
    ...recentActivity.lastWorkouts.map((workout) => ({
      type: "Workout",
      badge: "badge-error",
      description: workout.action || "Workout created",
      user: workout.creatorEmail,
      date: new Date(workout.timestamp),
      rawDate: workout.timestamp,
    })),
    ...recentActivity.lastNutritionPlans.map((plan) => ({
      type: "Nutrition",
      badge: "badge-accent",
      description: plan.action || "Nutrition plan updated",
      user: plan.user,
      date: new Date(plan.timestamp),
      rawDate: plan.timestamp,
    })),
  ];

  // Sort all activities by date (newest first)
  const sortedActivities = allActivities.sort((a, b) => b.date - a.date);

  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          {sortedActivities.length > 0 ? (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>
                      <div className={`badge ${activity.badge}`}>
                        {activity.type}
                      </div>
                    </td>
                    <td>{activity.description}</td>
                    <td>{activity.user}</td>
                    <td title={activity.date.toLocaleString()}>
                      {formatDate(activity.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
