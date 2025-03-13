import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../components/shared/Footer'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { Sidebar } from '../components/trainer/TrainerSidebar'
import { TrainerNavbar } from '../components/trainer/TrainerNavbar'

export const TrainerLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
    <ScrollToTop/>
    <div className="flex h-screen  bg-base-200 text-base-content">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
       
        <TrainerNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
         <Outlet/>
        </main>
      </div>
    </div>
  </>
  )
}
