import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


// import {
//   getTrainerProfile,
//   getTrainerClients,
//   getTrainerRevenue
// } from "../../services/trainerServices";

// import { TrainerSidebar } from "../../components/trainer/TrainerSidebar";

// import moment from "moment";
import {
  setClients,
  setError,
  setLoading,
  setRevenue,
  setTrainerProfile,
} from "../redux/features/trainerSlice";
// *************************
export const TrainerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const { profile, clients, revenue, loading, error } = useSelector(
    (state) => state.trainer
  );

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));

        // Fetch data from your existing endpoints
        // *************************************************
        // const profileResponse = await getTrainerProfile();
        // const clientsResponse = await getTrainerClients();
        // const revenueResponse = await getTrainerRevenue();

        // dispatch(setTrainerProfile(profileResponse.data));
        // dispatch(setClients(clientsResponse.data.clients));
        // dispatch(setRevenue(revenueResponse.data));

        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setError("Failed to load trainer dashboard data"));
        console.error("Trainer dashboard data fetch error:", error);
        dispatch(setLoading(false));
      }
    };

    fetchTrainerData();
  }, [dispatch]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  // Calculate summary stats from available data
  // const totalClients = clients?.length || 0;
  // const activeClients =
  //   clients?.filter((client) => client.status === "active")?.length || 0;
  // const totalRevenue = revenue?.totalAmount || 0;
  // const monthlyRevenue = revenue?.monthlyRevenue || 0;

  return (

    <></>

    // <div className="flex flex-col lg:flex-row min-h-screen bg-base-200">
    //   <div className="hidden lg:block">
    //     <TrainerSidebar />
    //   </div>

    //   <div className="flex-1 p-6">
    //     <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
    //       <div>
    //         <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
    //         <p className="text-gray-600">
    //           Welcome back, {profile?.name || "Trainer"}
    //         </p>
    //       </div>
    //       <div className="mt-4 md:mt-0">
    //         <button
    //           onClick={() => navigate("/trainer/profile/update")}
    //           className="btn btn-outline btn-primary mr-2"
    //         >
    //           Update Profile
    //         </button>
    //       </div>
    //     </div>

    //     {error && (
    //       <div className="alert alert-error mb-6">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           className="stroke-current shrink-0 h-6 w-6"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth="2"
    //             d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    //           />
    //         </svg>
    //         <span>{error}</span>
    //       </div>
    //     )}

    //     {loading ? (
    //       <div className="flex justify-center items-center h-64">
    //         <span className="loading loading-spinner loading-lg text-primary"></span>
    //       </div>
    //     ) : (
    //       <>
    //         {/* Summary Cards */}
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    //           {/* Total Clients Card */}
    //           <div className="card bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
    //             <div className="card-body p-6">
    //               <div className="flex justify-between items-center">
    //                 <h2 className="card-title text-gray-700">Total Clients</h2>
    //                 <div className="p-3 bg-blue-500 rounded-full">
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     className="h-6 w-6 text-white"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     stroke="currentColor"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth={2}
    //                       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    //                     />
    //                   </svg>
    //                 </div>
    //               </div>
    //               <p className="text-3xl font-bold mt-4 text-gray-800">
    //                 {totalClients}
    //               </p>
    //               <p className="text-sm text-gray-500 mt-2">
    //                 Overall clients registered
    //               </p>
    //             </div>
    //           </div>

    //           {/* Active Clients Card */}
    //           <div className="card bg-gradient-to-br from-green-50 to-green-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
    //             <div className="card-body p-6">
    //               <div className="flex justify-between items-center">
    //                 <h2 className="card-title text-gray-700">Active Clients</h2>
    //                 <div className="p-3 bg-green-500 rounded-full">
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     className="h-6 w-6 text-white"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     stroke="currentColor"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth={2}
    //                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    //                     />
    //                   </svg>
    //                 </div>
    //               </div>
    //               <p className="text-3xl font-bold mt-4 text-gray-800">
    //                 {activeClients}
    //               </p>
    //               <p className="text-sm text-gray-500 mt-2">
    //                 Currently active clients
    //               </p>
    //             </div>
    //           </div>

    //           {/* Total Revenue Card */}
    //           <div className="card bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
    //             <div className="card-body p-6">
    //               <div className="flex justify-between items-center">
    //                 <h2 className="card-title text-gray-700">Total Revenue</h2>
    //                 <div className="p-3 bg-purple-500 rounded-full">
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     className="h-6 w-6 text-white"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     stroke="currentColor"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth={2}
    //                       d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    //                     />
    //                   </svg>
    //                 </div>
    //               </div>
    //               <p className="text-3xl font-bold mt-4 text-gray-800">
    //                 {formatCurrency(totalRevenue)}
    //               </p>
    //               <p className="text-sm text-gray-500 mt-2">
    //                 Lifetime earnings
    //               </p>
    //             </div>
    //           </div>

    //           {/* Monthly Revenue Card */}
    //           <div className="card bg-gradient-to-br from-amber-50 to-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
    //             <div className="card-body p-6">
    //               <div className="flex justify-between items-center">
    //                 <h2 className="card-title text-gray-700">
    //                   Monthly Revenue
    //                 </h2>
    //                 <div className="p-3 bg-amber-500 rounded-full">
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     className="h-6 w-6 text-white"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     stroke="currentColor"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth={2}
    //                       d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    //                     />
    //                   </svg>
    //                 </div>
    //               </div>
    //               <p className="text-3xl font-bold mt-4 text-gray-800">
    //                 {formatCurrency(monthlyRevenue)}
    //               </p>
    //               <p className="text-sm text-gray-500 mt-2">
    //                 Current month's earnings
    //               </p>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Tabs Navigation */}
    //         <div className="flex mb-6 overflow-x-auto">
    //           <div className="tabs tabs-boxed">
    //             <a
    //               className={`tab ${
    //                 activeTab === "overview" ? "tab-active" : ""
    //               }`}
    //               onClick={() => setActiveTab("overview")}
    //             >
    //               Overview
    //             </a>
    //             <a
    //               className={`tab ${
    //                 activeTab === "clients" ? "tab-active" : ""
    //               }`}
    //               onClick={() => setActiveTab("clients")}
    //             >
    //               Clients
    //             </a>
    //             <a
    //               className={`tab ${
    //                 activeTab === "profile" ? "tab-active" : ""
    //               }`}
    //               onClick={() => setActiveTab("profile")}
    //             >
    //               My Profile
    //             </a>
    //             <a
    //               className={`tab ${
    //                 activeTab === "earnings" ? "tab-active" : ""
    //               }`}
    //               onClick={() => setActiveTab("earnings")}
    //             >
    //               Earnings
    //             </a>
    //           </div>
    //         </div>

    //         {/* Tab Content */}
    //         {activeTab === "overview" && (
    //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    //             {/* Trainer Profile Summary Card */}
    //             <div className="card bg-base-100 shadow-xl">
    //               <div className="card-body">
    //                 <div className="flex flex-col items-center mb-4">
    //                   <div className="avatar">
    //                     <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
    //                       <img
    //                         src={
    //                           profile?.image ||
    //                           "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    //                         }
    //                         alt="Trainer"
    //                       />
    //                     </div>
    //                   </div>
    //                   <h2 className="card-title mt-4">
    //                     {profile?.name || "Trainer Name"}
    //                   </h2>
    //                   <p className="text-sm text-gray-500">
    //                     {profile?.specialization || "Fitness Trainer"}
    //                   </p>

    //                   <div className="badge badge-accent mt-2">
    //                     {profile?.status || "Active"}
    //                   </div>
    //                 </div>

    //                 <div className="divider"></div>

    //                 <div className="space-y-2">
    //                   <div className="flex items-center">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       className="h-5 w-5 text-gray-500 mr-2"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       stroke="currentColor"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth={2}
    //                         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    //                       />
    //                     </svg>
    //                     <span>{profile?.email || "email@example.com"}</span>
    //                   </div>
    //                   <div className="flex items-center">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       className="h-5 w-5 text-gray-500 mr-2"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       stroke="currentColor"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth={2}
    //                         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    //                       />
    //                     </svg>
    //                     <span>{profile?.phone || "Not provided"}</span>
    //                   </div>
    //                   <div className="flex items-center">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       className="h-5 w-5 text-gray-500 mr-2"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       stroke="currentColor"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth={2}
    //                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    //                       />
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth={2}
    //                         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    //                       />
    //                     </svg>
    //                     <span>
    //                       {profile?.location || "Location not provided"}
    //                     </span>
    //                   </div>
    //                 </div>

    //                 <div className="card-actions justify-end mt-4">
    //                   <button
    //                     className="btn btn-primary btn-sm"
    //                     onClick={() => navigate("/trainer/profile/update")}
    //                   >
    //                     Edit Profile
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Client Activity & Revenue Overview */}
    //             <div className="card bg-base-100 shadow-xl lg:col-span-2">
    //               <div className="card-body">
    //                 <h2 className="card-title">Revenue Overview</h2>

    //                 {revenue?.monthlyBreakdown && (
    //                   <div className="mt-4">
    //                     <div className="overflow-x-auto">
    //                       <table className="table w-full">
    //                         <thead>
    //                           <tr>
    //                             <th>Month</th>
    //                             <th className="text-right">Revenue</th>
    //                             <th className="text-right">Clients</th>
    //                           </tr>
    //                         </thead>
    //                         <tbody>
    //                           {revenue.monthlyBreakdown.map((month, index) => (
    //                             <tr key={index} className="hover">
    //                               <td>{month.month}</td>
    //                               <td className="text-right">
    //                                 {formatCurrency(month.amount)}
    //                               </td>
    //                               <td className="text-right">
    //                                 {month.clientCount}
    //                               </td>
    //                             </tr>
    //                           ))}
    //                         </tbody>
    //                         <tfoot>
    //                           <tr>
    //                             <th>Total</th>
    //                             <th className="text-right">
    //                               {formatCurrency(totalRevenue)}
    //                             </th>
    //                             <th className="text-right">{totalClients}</th>
    //                           </tr>
    //                         </tfoot>
    //                       </table>
    //                     </div>
    //                   </div>
    //                 )}

    //                 {!revenue?.monthlyBreakdown && (
    //                   <div className="alert alert-info mt-4">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       className="stroke-current shrink-0 w-6 h-6"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth="2"
    //                         d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    //                       ></path>
    //                     </svg>
    //                     <span>No revenue data available yet.</span>
    //                   </div>
    //                 )}

    //                 <div className="card-actions justify-end mt-4">
    //                   <button
    //                     className="btn btn-ghost btn-sm"
    //                     onClick={() => setActiveTab("earnings")}
    //                   >
    //                     View Full Details
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Recent Clients */}
    //             <div className="card bg-base-100 shadow-xl lg:col-span-3">
    //               <div className="card-body">
    //                 <h2 className="card-title">Recent Clients</h2>
    //                 <div className="overflow-x-auto mt-4">
    //                   <table className="table w-full">
    //                     <thead>
    //                       <tr>
    //                         <th>Client</th>
    //                         <th>Email</th>
    //                         <th>Status</th>
    //                         <th>Joined</th>
    //                         <th>Action</th>
    //                       </tr>
    //                     </thead>
    //                     <tbody>
    //                       {clients && clients.length > 0 ? (
    //                         clients.slice(0, 5).map((client) => (
    //                           <tr key={client._id} className="hover">
    //                             <td>
    //                               <div className="flex items-center space-x-3">
    //                                 <div className="avatar">
    //                                   <div className="mask mask-squircle w-12 h-12">
    //                                     <img
    //                                       src={
    //                                         client.image ||
    //                                         "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    //                                       }
    //                                       alt="Client"
    //                                     />
    //                                   </div>
    //                                 </div>
    //                                 <div>
    //                                   <div className="font-bold">
    //                                     {client.name}
    //                                   </div>
    //                                   <div className="text-sm opacity-50">
    //                                     {client.location ||
    //                                       "Location not specified"}
    //                                   </div>
    //                                 </div>
    //                               </div>
    //                             </td>
    //                             <td>{client.email}</td>
    //                             <td>
    //                               <div
    //                                 className={`badge ${
    //                                   client.status === "active"
    //                                     ? "badge-success"
    //                                     : "badge-ghost"
    //                                 }`}
    //                               >
    //                                 {client.status || "Inactive"}
    //                               </div>
    //                             </td>
    //                             <td>
    //                               {client.createdAt
    //                                 ? moment(client.createdAt).format(
    //                                     "DD MMM YYYY"
    //                                   )
    //                                 : "N/A"}
    //                             </td>
    //                             <td>
    //                               <Link
    //                                 to={`/trainer/clients/${client._id}`}
    //                                 className="btn btn-ghost btn-xs"
    //                               >
    //                                 View
    //                               </Link>
    //                             </td>
    //                           </tr>
    //                         ))
    //                       ) : (
    //                         <tr>
    //                           <td colSpan="5" className="text-center">
    //                             No clients found
    //                           </td>
    //                         </tr>
    //                       )}
    //                     </tbody>
    //                   </table>
    //                 </div>
    //                 <div className="card-actions justify-end mt-4">
    //                   <button
    //                     className="btn btn-ghost btn-sm"
    //                     onClick={() => setActiveTab("clients")}
    //                   >
    //                     View All Clients
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         )}

    //         {activeTab === "clients" && (
    //           <div className="card bg-base-100 shadow-xl">
    //             <div className="card-body">
    //               <div className="flex justify-between items-center mb-6">
    //                 <h2 className="card-title">All Clients</h2>
    //                 <input
    //                   type="text"
    //                   placeholder="Search clients"
    //                   className="input input-bordered w-full max-w-xs"
    //                 />
    //               </div>

    //               <div className="overflow-x-auto">
    //                 <table className="table w-full">
    //                   <thead>
    //                     <tr>
    //                       <th>Client</th>
    //                       <th>Email</th>
    //                       <th>Phone</th>
    //                       <th>Status</th>
    //                       <th>Joined</th>
    //                       <th>Action</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {clients && clients.length > 0 ? (
    //                       clients.map((client) => (
    //                         <tr key={client._id} className="hover">
    //                           <td>
    //                             <div className="flex items-center space-x-3">
    //                               <div className="avatar">
    //                                 <div className="mask mask-squircle w-12 h-12">
    //                                   <img
    //                                     src={
    //                                       client.image ||
    //                                       "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    //                                     }
    //                                     alt="Client"
    //                                   />
    //                                 </div>
    //                               </div>
    //                               <div>
    //                                 <div className="font-bold">
    //                                   {client.name}
    //                                 </div>
    //                                 <div className="text-sm opacity-50">
    //                                   {client.location ||
    //                                     "Location not specified"}
    //                                 </div>
    //                               </div>
    //                             </div>
    //                           </td>
    //                           <td>{client.email}</td>
    //                           <td>{client.phone || "N/A"}</td>
    //                           <td>
    //                             <div
    //                               className={`badge ${
    //                                 client.status === "active"
    //                                   ? "badge-success"
    //                                   : "badge-ghost"
    //                               }`}
    //                             >
    //                               {client.status || "Inactive"}
    //                             </div>
    //                           </td>
    //                           <td>
    //                             {client.createdAt
    //                               ? moment(client.createdAt).format(
    //                                   "DD MMM YYYY"
    //                                 )
    //                               : "N/A"}
    //                           </td>
    //                           <td>
    //                             <Link
    //                               to={`/trainer/clients/${client._id}`}
    //                               className="btn btn-ghost btn-xs"
    //                             >
    //                               View
    //                             </Link>
    //                           </td>
    //                         </tr>
    //                       ))
    //                     ) : (
    //                       <tr>
    //                         <td colSpan="6" className="text-center">
    //                           No clients found
    //                         </td>
    //                       </tr>
    //                     )}
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //           </div>
    //         )}

    //         {activeTab === "profile" && (
    //           <div className="card bg-base-100 shadow-xl">
    //             <div className="card-body">
    //               <h2 className="card-title mb-6">Trainer Profile</h2>

    //               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    //                 <div className="lg:col-span-1">
    //                   <div className="flex flex-col items-center justify-center p-6 bg-base-200 rounded-box">
    //                     <div className="avatar">
    //                       <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
    //                         <img
    //                           src={
    //                             profile?.image ||
    //                             "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    //                           }
    //                           alt="Trainer"
    //                         />
    //                       </div>
    //                     </div>
    //                     <h2 className="text-2xl font-bold mt-4">
    //                       {profile?.name || "Trainer Name"}
    //                     </h2>
    //                     <p className="text-gray-500">
    //                       {profile?.specialization || "Fitness Trainer"}
    //                     </p>

    //                     <div className="badge badge-accent mt-2">
    //                       {profile?.status || "Active"}
    //                     </div>

    //                     <button
    //                       className="btn btn-primary mt-6"
    //                       onClick={() => navigate("/trainer/profile/update")}
    //                     >
    //                       Edit Profile
    //                     </button>
    //                   </div>
    //                 </div>

    //                 <div className="lg:col-span-2">
    //                   <div className="p-6 bg-base-200 rounded-box">
    //                     <h3 className="text-xl font-bold mb-4">
    //                       Personal Information
    //                     </h3>

    //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                       <div>
    //                         <label className="text-sm text-gray-500">
    //                           Email
    //                         </label>
    //                         <p className="text-lg">
    //                           {profile?.email || "email@example.com"}
    //                         </p>
    //                       </div>
    //                       <div>
    //                         <label className="text-sm text-gray-500">
    //                           Phone
    //                         </label>
    //                         <p className="text-lg">
    //                           {profile?.phone || "Not provided"}
    //                         </p>
    //                       </div>
    //                       <div>
    //                         <label className="text-sm text-gray-500">
    //                           Location
    //                         </label>
    //                         <p className="text-lg">
    //                           {profile?.location || "Not provided"}
    //                         </p>
    //                       </div>
    //                       <div>
    //                         <label className="text-sm text-gray-500">
    //                           Joined
    //                         </label>
    //                         <p className="text-lg">
    //                           {profile?.createdAt
    //                             ? moment(profile.createdAt).format(
    //                                 "DD MMM YYYY"
    //                               )
    //                             : "N/A"}
    //                         </p>
    //                       </div>
    //                     </div>

    //                     <h3 className="text-xl font-bold mt-8 mb-4">
    //                       About Me
    //                     </h3>
    //                     <p className="text-gray-700">
    //                       {profile?.about || "No information provided."}
    //                     </p>

    //                     {profile?.skills && profile.skills.length > 0 && (
    //                       <>
    //                         <h3 className="text-xl font-bold mt-8 mb-4">
    //                           Skills & Expertise
    //                         </h3>
    //                         <div className="flex flex-wrap gap-2">
    //                           {profile.skills.map((skill, index) => (
    //                             <div
    //                               key={index}
    //                               className="badge badge-secondary badge-lg"
    //                             >
    //                               {skill}
    //                             </div>
    //                           ))}
    //                         </div>
    //                       </>
    //                     )}
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         )}

    //         {activeTab === "earnings" && (
    //           <div className="card bg-base-100 shadow-xl">
    //             <div className="card-body">
    //               <h2 className="card-title mb-6">Earnings & Revenue</h2>

    //               <div className="stats shadow mb-6">
    //                 <div className="stat">
    //                   <div className="stat-title">Total Revenue</div>
    //                   <div className="stat-value">
    //                     {formatCurrency(totalRevenue)}
    //                   </div>
    //                   <div className="stat-desc">Lifetime earnings</div>
    //                 </div>

    //                 <div className="stat">
    //                   <div className="stat-title">This Month</div>
    //                   <div className="stat-value">
    //                     {formatCurrency(monthlyRevenue)}
    //                   </div>
    //                   <div className="stat-desc">Current month's earnings</div>
    //                 </div>

    //                 <div className="stat">
    //                   <div className="stat-title">Total Clients</div>
    //                   <div className="stat-value">{totalClients}</div>
    //                   <div className="stat-desc">Active: {activeClients}</div>
    //                 </div>
    //               </div>

    //               {revenue?.monthlyBreakdown &&
    //               revenue.monthlyBreakdown.length > 0 ? (
    //                 <div className="overflow-x-auto">
    //                   <table className="table w-full">
    //                     <thead>
    //                       <tr>
    //                         <th>Month</th>
    //                         <th>Clients</th>
    //                         <th className="text-right">Revenue</th>
    //                         <th className="text-right">Avg. per Client</th>
    //                       </tr>
    //                     </thead>
    //                     <tbody>
    //                       {revenue.monthlyBreakdown.map((month, index) => {
    //                         const avgPerClient =
    //                           month.clientCount > 0
    //                             ? month.amount / month.clientCount
    //                             : 0;

    //                         return (
    //                           <tr key={index} className="hover">
    //                             <td>{month.month}</td>
    //                             <td>{month.clientCount}</td>
    //                             <td className="text-right">
    //                               {formatCurrency(month.amount)}
    //                             </td>
    //                             <td className="text-right">
    //                               {formatCurrency(avgPerClient)}
    //                             </td>
    //                           </tr>
    //                         );
    //                       })}
    //                     </tbody>
    //                     <tfoot>
    //                       <tr>
    //                         <th>Total</th>
    //                         <th>{totalClients}</th>
    //                         <th className="text-right">
    //                           {formatCurrency(totalRevenue)}
    //                         </th>
    //                         <th className="text-right">
    //                           {formatCurrency(
    //                             totalClients > 0
    //                               ? totalRevenue / totalClients
    //                               : 0
    //                           )}
    //                         </th>
    //                       </tr>
    //                     </tfoot>
    //                   </table>
    //                 </div>
    //               ) : (
    //                 <div className="alert alert-info">
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     className="stroke-current shrink-0 w-6 h-6"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth="2"
    //                       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    //                     ></path>
    //                   </svg>
    //                   <span>No revenue data available yet.</span>
    //                 </div>
    //               )}

    //               <div className="alert alert-warning mt-6">
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   className="stroke-current shrink-0 h-6 w-6"
    //                   fill="none"
    //                   viewBox="0 0 24 24"
    //                 >
    //                   <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     strokeWidth="2"
    //                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    //                   />
    //                 </svg>
    //                 <span>
    //                   Note: Revenue data is updated at the end of each month.
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //       </>
    //     )}
    //   </div>
    // </div>
  

);
};
