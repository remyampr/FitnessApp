import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Footer } from '../components/shared/Footer'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { useDispatch, useSelector } from 'react-redux'
import { MainNavbar } from '../components/shared/MainNavbar'

export const MainLayout = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const user = useSelector((state) => state.user.user);
  const trainer = useSelector((state) => state.trainer.trainer);
  const admin = useSelector((state) => state.admin.admin);

 

  return (
   <>
   <ScrollToTop/>
    <div className='flex flex-col min-h-screen bg-[url("/fit10.jpg")] bg-cover bg-center '> 
     <div className='flex flex-col min-h-screen bg-base-100-bg-cover bg-center'>  
        <MainNavbar/>
      <div  className=' flex-grow p-3 items-center justify-center min-h-screen ' > 
        <Outlet/> 
        </div>
      <Footer/>
        </div>
        </div>
        </>

  )
}

