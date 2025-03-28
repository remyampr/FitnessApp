export const dashboardMetadata = {
    totalUsers: {
      title: "Total Users",
      iconColor: "bg-blue-100 text-blue-500",
      link: "/admin/users",
      linkText: "View all users →",
      iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    activeUsers: {
      title: "Active Users",
      iconColor: "bg-green-100 text-green-500",
      link: "/admin/users?status=active",
      linkText: "View active users →",
      iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    totalTrainers: {
      title: "Total Trainers",
      iconColor: "bg-purple-100 text-purple-500",
     link: "/admin/users?type=trainer",
      linkText: "View all trainers →",
      iconPath: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    pendingApproval: {
      title: "Pending Approvals",
      iconColor: "bg-yellow-100 text-yellow-600",
      link: "/admin/approvals",
      linkText: "Review approvals →",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    totalRevenue: {
      title: "Total Revenue",
      iconColor: "bg-emerald-100 text-emerald-600",
      link: "/admin/revenue",
      linkText: "View revenue details →",
      iconPath: "M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    totalAppointments: {
      title: "Total Appointments",
      iconColor: "bg-indigo-100 text-indigo-500",
      link: "/admin/appointments",
      linkText: "View all appointments →",
      iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    upcomingAppointments: {
      title: "Upcoming Appointments",
      iconColor: "bg-blue-100 text-blue-600",
      link: "/admin/appointments?filter=upcoming",
      linkText: "View upcoming →",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    totalWorkouts: {
      title: "Total Workouts",
      iconColor: "bg-red-100 text-red-500",
      link: "/admin/workouts",
      linkText: "View all workouts →",
      iconPath: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    totalNutritionPlans: {
      title: "Nutrition Plans",
      iconColor: "bg-amber-100 text-amber-600",
      link: "/admin/nutrition",
      linkText: "View nutrition plans →",
      iconPath: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    }
  };