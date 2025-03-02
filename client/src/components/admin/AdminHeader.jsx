import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { adminLogout } from "../../services/adminServices";
import { toast } from "react-toastify";
import { clearAdmin } from "../../redux/features/adminSlice";
import { DarkMode } from "../shared/DarkMode";

export const AdminHeader = () => {

  const dispatch=useDispatch();

    const adminData=useSelector((state)=> state.admin);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
     const res=await adminLogout();
      dispatch(clearAdmin());
        console.log("res : ",res);
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
              <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </label>
              {isMenuOpen && (
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-primary">
                  <li><Link to="/admin/dashboard">Dashboard</Link></li>
                  <li><Link to="/admin/trainers">Trainers</Link></li>
                  <li><Link to="/admin/users">Users</Link></li>
                  <li><Link to="/admin/trainers/unapproved">Approvals</Link></li>
                  {/* Add more sidebar links as needed */}
                </ul>
              )}
            </div>
            <Link to="/admin/dashboard" className="btn btn-ghost normal-case text-xl">
              Admin Portal
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            {/* Center content if needed */}
          </div>
          <div className="navbar-end">
            {adminData.admin ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <span className="font-medium">Admin: {adminData.admin.name}</span>
                </div>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      <div className="placeholder bg-neutral-focus text-neutral-content rounded-full w-10">
                        <span>{adminData.admin.name ? adminData.admin.name.charAt(0).toUpperCase() : "A"}</span>
                      </div>
                    </div>
                  </label>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-primary">
                    <li><Link to="/admin/profile">Profile</Link></li>
                    <li><Link to="/admin/settings">Settings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link to="/admin/login" className="btn btn-outline btn-sm">Login</Link>
            )}

            <DarkMode/>
          </div>
        </div>
      </div>
    </header>
  );
};
