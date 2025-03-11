import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { adminLogout } from "../../services/adminServices";
import { toast } from "react-toastify";
import { clearAdmin } from "../../redux/features/adminSlice";
import { DarkMode } from "../shared/DarkMode";
import { LogOut } from "lucide-react";

export const AdminHeader = () => {
  const dispatch = useDispatch();

  const adminData = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await adminLogout();
      dispatch(clearAdmin());
      console.log("res : ", res);
      toast.success("Logout!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Failed to logout", error);
      toast.error(response.data.error);
    }
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-ghost lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              {isMenuOpen && (
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-primary"
                >
                  <li>
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/admin/trainers">Trainers</Link>
                  </li>
                  <li>
                    <Link to="/admin/users">Users</Link>
                  </li>
                  <li>
                    <Link to="/admin/trainers/unapproved">Approvals</Link>
                  </li>
                </ul>
              )}
            </div>
            <Link
              to="/admin/dashboard"
              className="btn btn-ghost normal-case text-xl"
            >
              Admin Portal
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex"></div>
          <div className="navbar-end">
            {adminData.admin ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <span className="font-medium">
                    Admin: {adminData.admin.name}
                  </span>
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-transparent"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/admin/login" className="btn btn-outline btn-sm">
                Login
              </Link>
            )}

            <DarkMode />
          </div>
        </div>
      </div>
    </header>
  );
};
