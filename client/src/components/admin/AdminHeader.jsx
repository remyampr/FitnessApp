import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { adminLogout } from "../../services/adminServices";
import { toast } from "react-toastify";
import { clearAdmin } from "../../redux/features/adminSlice";
import { DarkMode } from "../shared/DarkMode";
import { LogOut, Menu } from "lucide-react";

export const AdminHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await adminLogout();
      dispatch(clearAdmin());
      console.log("res : ", res);
      toast.success("Logout!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Failed to logout", error);
      toast.error(error.response?.data?.error || "Logout failed");
    }
  };

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="navbar h-16">
          <div className="navbar-start">
            <Link
              to="/admin/dashboard"
              className="btn btn-ghost normal-case text-xl"
            >
              Admin Portal
            </Link>
          </div>
          
          <div className="navbar-end">
            {adminData.admin ? (
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:block">
                  <span className="font-medium">
                    Admin: {adminData.admin.name}
                  </span>
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 md:px-4 py-2 text-sm font-medium text-white hover:text-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
                <DarkMode />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/admin/login" className="btn btn-outline btn-sm text-white">
                  Login
                </Link>
                <DarkMode />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};