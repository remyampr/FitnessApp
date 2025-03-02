import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDashboardStats,
  setLoading,
  setError,
  setUsers,
  setTrainers,
} from "../../redux/features/adminSlice";
import { getAdminDashboard, getAdminUsers, getTrainers } from "../../services/adminServices";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import { dashboardMetadata } from "../../data/dashboardMetadata";
import { DashboardCard } from "../../components/admin/DashBoardCard";
import { RecentActivity } from "../../components/admin/RecentActivity";

export const AdminDashboard = () => {

  const navigate=useNavigate();
  const dispatch = useDispatch();
  const { users,trainers,dashboardStats, loading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        dispatch(setError(null))
        dispatch(setLoading(true));
        const response = await getAdminDashboard();

          const userResponse = await getAdminUsers();
          const trainerResponse = await getTrainers();

        // console.log("Trainer Response : ", trainerResponse);
   

        dispatch(setDashboardStats(response.data));
        dispatch(setUsers(userResponse.data.users));
        dispatch(setTrainers(trainerResponse.data.users));

        // console.log("in state dashboard stats: ", dashboardStats);
        // console.log("in state users: ",users);
        // console.log("in state Trainers: ", trainers);


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
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 w-full">
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


              {Object.keys(dashboardMetadata).map((key)=>{
                const metadata=dashboardMetadata[key];
              


                return(
                  <DashboardCard
                  key={key}
              title={metadata.title}
              iconColor={metadata.iconColor}
              iconPath={metadata.iconPath}
              link={metadata.title === "Active Users" ? null : metadata.link}
              linkText={metadata.linkText}
              value={dashboardStats[key]} 
                  />
                )
              })}

            </div>

            {/* Recent Activity Section */}
          <RecentActivity />
           
          </>
        )}
      </div>
    </div>
  );
};
