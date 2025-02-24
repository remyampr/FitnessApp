import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/shared/Header'
import { Footer } from '../components/shared/Footer'
import { ScrollToTop } from '../components/shared/ScrollToTop'

export const UserLayout = () => {
  return (
    <>
      <ScrollToTop/>
      <div className='flex flex-col min-h-screen bg-gray-100'>
        <Header/>
        <div className='flex-grow p-3 items-center justify-center min-h-screen'>
          <Outlet/>
        </div>
        <Footer/>
      </div>
    </>
  )
}
