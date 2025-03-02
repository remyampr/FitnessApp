import React from 'react'
import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { Navbar } from '../components/shared/Navbar'
import { UserSidebar } from '../components/user/UserSidebar'

export const UserLayout = () => {
  return (
      <>
      <ScrollToTop/>
      <div className="flex h-screen  bg-gray-200 text-base-content">
        <UserSidebar/>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
           <Outlet/>
          </main>
        </div>
      </div>
    </>
    )
}
