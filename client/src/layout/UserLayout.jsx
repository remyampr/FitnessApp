import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { UserSidebar } from '../components/user/UserSidebar'
import { UserNavbar } from '../components/user/UserNavbar'

export const UserLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
      <>
      <ScrollToTop />
      <UserNavbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-col md:flex-row">
        <UserSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </>
    )
}
