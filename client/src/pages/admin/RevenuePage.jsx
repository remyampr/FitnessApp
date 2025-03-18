import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RevenueChart } from "../../components/admin/RevenueChart";
import {
  setAdminRevenue,
  setError,
  setLoading,
  setPayments,
  setRevenueBreakdown,
  setTotalRevenue,
  setTrainerRevenue,
} from "../../redux/features/adminSlice";
import {
  getRevenueBreakdown,
  getRevenueData,
} from "../../services/adminServices";
import { PaymentsTable } from "./PaymentsTable";

export const RevenuePage = () => {
  const dispatch = useDispatch();
  const [dateFilter, setDateFilter] = useState("all");
  const {
    totalRevenue,
    adminRevenue,
    trainerRevenue,
    payments,
    loading,
    error,
    breakdown,
  } = useSelector((state) => state.admin);

  console.log("Inside store!!!");
  console.log("Inside store!!! Total Revenue:", totalRevenue);
  console.log("Inside store!!! Admin Revenue:", adminRevenue);
  console.log("Inside store!!! Trainer Revenue:", trainerRevenue);
  console.log("Inside store!!! Payments:", payments);

  console.log("Inside store!!! Breakdown:", breakdown);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // Fetch overall revenue data
        const revenueResponse = await getRevenueData({
          period: dateFilter,
        });

        console.log("revenue response : ", revenueResponse.data);

        // Fetch revenue breakdown
        const breakdownResponse = await getRevenueBreakdown();

        console.log("revenue breakdown response : ", breakdownResponse.data);

        dispatch(setTotalRevenue(revenueResponse.data.totalRevenue));
        dispatch(setAdminRevenue(revenueResponse.data.adminRevenue));
        dispatch(setTrainerRevenue(revenueResponse.data.trainerRevenue));
        dispatch(setPayments(revenueResponse.data.payments));
        dispatch(setRevenueBreakdown(breakdownResponse.data));

        console.log("revenue breakdown in store : ", breakdown);
        console.log("Total revenue in store : ", totalRevenue);
        console.log("Admin Revenue in store : ", adminRevenue);
        console.log("trainer revenue in store : ", trainerRevenue);
        console.log("payments in store : ", payments);

        dispatch(setLoading(false));
      } catch (fetchError) {
        dispatch(setError("Failed to load revenue data"));
        dispatch(setLoading(false));
      }
    };

    fetchRevenueData();
  }, [dispatch, dateFilter]);

  // Format currency utility
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 w-full p-0">
      <div className="flex-1 p-1">
        <h1 className="text-3xl font-bold mb-6">Revenue Dashboard</h1>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Total Revenue</h2>
              <p className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Admin Revenue</h2>
              <p className="text-2xl font-bold">
                {formatCurrency(adminRevenue)}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Trainer Revenue</h2>
              <p className="text-2xl font-bold">
                {formatCurrency(trainerRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-6">
          <select
            className="select select-bordered w-full max-w-xs"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        <RevenueChart data={breakdown?.monthlyRevenue} />

        <PaymentsTable payments={payments} />
      </div>
    </div>
  );
};
