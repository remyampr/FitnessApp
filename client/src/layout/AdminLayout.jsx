import React from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminFooter } from "../components/admin/AdminFooter";


export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <main className="flex-grow container mx-auto px-4 py-6">
        
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};
