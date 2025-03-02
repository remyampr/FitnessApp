import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/shared/Header'
import { Footer } from '../components/shared/Footer'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { DarkMode } from '../components/shared/DarkMode'
import { Sidebar } from '../components/trainer/Sidebar'
import { Navbar } from '../components/shared/Navbar'

export const TrainerLayout = () => {
  return (
    <>
    <ScrollToTop/>
    <div className="flex h-screen  bg-gray-200 text-base-content">
      <Sidebar />
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
