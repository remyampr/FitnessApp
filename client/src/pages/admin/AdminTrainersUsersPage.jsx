// Example structure for AdminUsersList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import {
  setError,
  setLoading,
  setUsers,
  setTrainers
} from "../../redux/features/adminSlice";
import { getAdminUsers } from "../../services/adminServices";
import { Pagination } from "../../components/shared/Pagination";

import { UserCard } from "../../components/admin/UserCard";
import { TrainerCard } from "../../components/admin/TrainerCard";



export const AdminTrainersUsersPage = () => {


  const dispatch = useDispatch();
  const { users,trainers, loading, error } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("users");
  // const [filters, setFilters] = useState({ status: "all" });

  const location = useLocation();
 

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const type = params.get("type");

    if (type === "trainer") {
      setSelectedType("trainers");
    }else {
      setSelectedType("users"); 
    }

    // const fetchAdminUsers = async () => {
    //   try {
    //     dispatch(setError(null));
    //     dispatch(setLoading(true));
    //     // const {users}=useSelector((state)=> state.admin)
    //     dispatch(setLoading(false));
    //   } catch (error) {
    //     dispatch(setError("Failed to load Users"));
    //     console.error("User fetch error:", error);
    //     dispatch(setLoading(false));
    //   }
    // };

    // fetchAdminUsers();
  
  
  },  [location.search]);

  const dataToDisplay = selectedType === "users" ? users : trainers;

  

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-6">
        <div className="mb-8">
        <h1 className="text-3xl font-bold">{selectedType === "users" ? "Users" : "Trainers"}</h1>
        <p className="text-gray-600">Manage all system {selectedType}</p>
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
            {/* Filters */}
            <div className="card bg-base-100 shadow-xl mb-6 p-4">
              {/* Filter controls */}
            </div>

            {/* Users Grid */}
            {dataToDisplay?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataToDisplay.map((item) => (
                  selectedType === "users" ? (
                    <UserCard key={item._id} user={item} />
                  ) : (
                    <TrainerCard key={item._id} trainer={item} />
                  )
                ))}
              </div>
            ) : (
              <p>No {selectedType} found</p>
            )}
          </>
        )}

{/* Pagination */}
<Pagination 
  currentPage={page} 
  totalPages={Math.ceil(users.totalCount / 10)} 
  onPageChange={setPage}
/>

      </div>
    </div>
  );
};
