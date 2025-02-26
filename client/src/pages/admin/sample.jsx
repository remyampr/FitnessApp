import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDashboardStats,
  setLoading,
  setError,
} from "../../redux/features/adminSlice";
import { getAdminDashboard } from "../../services/adminServices";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        dispatch(setError(null))
        dispatch(setLoading(true));
        const response = await getAdminDashboard();

        console.log("response : ", response);
        console.log("in state dashboard stats: ", dashboardStats);
   

        dispatch(setDashboardStats(response.data));

        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setError("Failed to load dashboard data"));
        console.error("Dashboard data fetch error:", error);
        dispatch(setLoading(false));
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin dashboard</p>
        </div>
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Users Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title text-lg">Total Users</h2>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2">
                    {dashboardStats.totalUsers.toLocaleString()}
                  </p>
                  <div className="card-actions mt-4">
                    <Link
                      to="/admin/users"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View all users →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Active Users Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title text-lg">Active Users</h2>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2">
                    {dashboardStats.activeUsers.toLocaleString()}
                  </p>
                  <div className="card-actions mt-4">
                    <span className="text-sm text-gray-500">
                      {Math.round(
                        (dashboardStats.activeUsers /
                          dashboardStats.totalUsers) *
                          100
                      )}
                      % of total users
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Trainers Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title text-lg">Total Trainers</h2>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2">
                    {dashboardStats.totalTrainers.toLocaleString()}
                  </p>
                  <div className="card-actions mt-4">
                    <Link
                      to="/admin/trainers"
                      className="text-sm text-purple-500 hover:underline"
                    >
                      View all trainers →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pending Approvals Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title text-lg">Pending Approvals</h2>
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2">{dashboardStats?.pendingApproval?.toLocaleString()}</p>
                  <div className="card-actions mt-4">
                    <Link
                      to="/admin/trainers/unapproved"
                      className="text-sm text-yellow-500 hover:underline"
                    >
                      Review pending trainers →
                    </Link>
                  </div>
                </div>
              </div>

               {/* Total Revenue Card */}
     <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title text-lg">Total Revenue</h2>
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardStats.totalRevenue)}</p>
                  <div className="card-actions mt-4">
                    <Link to="/admin/revenue" className="text-sm text-emerald-500 hover:underline">View revenue details →</Link>
                  </div>
                </div>
              </div>

              {/* Other Cards (Active Users, Total Trainers, appointments,nutrition data,workout data,) */}
              {/* Similar structure as the Total Users card, but replace data with respective stats */}
            </div>

            {/* Recent Activity Section */}
            {/* This would normally be populated with data from your API */}
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body">
                <h2 className="card-title mb-4">Recent Activity</h2>
                <div className="overflow-x-auto">
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
                      <tr>
                        <td>
                          <div className="badge badge-info">User</div>
                        </td>
                        <td>New user registered</td>
                        <td>john.doe@example.com</td>
                        <td>2 hours ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};




// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setDashboardStats,
//   setLoading,
//   setError,
// } from "../../redux/features/adminSlice";
// import { getAdminDashboard } from "../../services/adminServices";
// import { AdminSidebar } from "../../components/admin/AdminSidebar";
// import { Link } from "react-router-dom";

// export const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { dashboardStats, loading, error } = useSelector(
//     (state) => state.admin
//   );

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         dispatch(setError(null));
//         dispatch(setLoading(true));
//         const response = await getAdminDashboard();
        
//         dispatch(setDashboardStats(response.data));
//         dispatch(setLoading(false));
//       } catch (error) {
//         dispatch(setError("Failed to load dashboard data"));
//         console.error("Dashboard data fetch error:", error);
//         dispatch(setLoading(false));
//       }
//     };

//     fetchDashboardData();
//   }, [dispatch]);

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(amount);
//   };

//   // Define dashboard card metadata dynamically
//   const dashboardCardMetadata = {
//     totalUsers: {
//       title: "Total Users",
//       iconColor: "bg-blue-100 text-blue-500",
//       link: "/admin/users",
//       linkText: "View all users →",
//       iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
//     },
//     activeUsers: {
//       title: "Active Users",
//       iconColor: "bg-green-100 text-green-500",
//       link: "",
//       linkText: "",
//       iconPath: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
//     },
//     totalTrainers: {
//       title: "Total Trainers",
//       iconColor: "bg-purple-100 text-purple-500",
//       link: "/admin/trainers",
//       linkText: "View all trainers →",
//       iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
//     },
//     totalRevenue: {
//       title: "Total Revenue",
//       iconColor: "bg-emerald-100 text-emerald-500",
//       link: "/admin/revenue",
//       linkText: "View revenue details →",
//       iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
//     },
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//       {Object.entries(dashboardStats).map(([key, value]) => {
//         const card = dashboardCardMetadata[key];
//         if (!card) return null; // Skip if no metadata exists for the key
//         return (
//           <div key={key} className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <div className="flex justify-between items-center">
//                 <h2 className="card-title text-lg">{card.title}</h2>
//                 <div className={`${card.iconColor} p-2 rounded-lg`}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.iconPath} />
//                   </svg>
//                 </div>
//               </div>
//               <p className="text-3xl font-bold mt-2">
//                 {key === "totalRevenue" ? formatCurrency(value) : value.toLocaleString()}
//               </p>
//               {card.link && (
//                 <div className="card-actions mt-4">
//                   <Link to={card.link} className="text-sm hover:underline" style={{ color: card.iconColor.split(" ")[1] }}>
//                     {card.linkText}
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };











