import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { UserSidebar } from '../components/user/UserSidebar'
import { UserNavbar } from '../components/user/UserNavbar'

export const UserLayout = () => {
  console.log("UserLayout rendering");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location=useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const hideLayout=location.pathname === "/user/complete-profile"

  return (
      <>
     <ScrollToTop />
      {!hideLayout && <UserNavbar toggleSidebar={toggleSidebar} />}
      <div className="flex flex-col md:flex-row">
        {!hideLayout && <UserSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </>
    )
}
