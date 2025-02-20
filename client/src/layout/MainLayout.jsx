import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/shared/Header'
import { Footer } from '../components/shared/Footer'
import { ScrollToTop } from '../components/shared/ScrollToTop'

export const MainLayout = () => {
  return (
   <>
   <ScrollToTop/>
    <div className='flex flex-col min-h-screen bg-[url("/fit18.jpg")] bg-cover bg-center'> 
     {/* <div className='flex flex-col min-h-screen bg-red-500 bg-cover bg-center'>   */}
        <Header/>
      <div  className=' flex-grow p-3 items-center justify-center min-h-screen text-white' > 
        <Outlet/> 
        </div>
      <Footer/>
        </div>
        </>

  )
}

