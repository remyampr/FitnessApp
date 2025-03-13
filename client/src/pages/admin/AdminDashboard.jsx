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
import { Link, useNavigate } from "react-router-dom";
import { dashboardMetadata } from "../../data/dashboardMetadata";
import { DashboardCard } from "../../components/admin/DashBoardCard";
import { RecentActivity } from "../../components/admin/RecentActivity";
import { AlertError } from "../../components/shared/AlertError";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

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
    

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin dashboard</p>
        </div>
        {error && (
          <AlertError error={error} />
        )}

        {loading ? (
          <LoadingSpinner/>
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
