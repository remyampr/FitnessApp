import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from '../components/shared/Header'
import { Footer } from '../components/shared/Footer'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { useDispatch, useSelector } from 'react-redux'

export const MainLayout = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const user = useSelector((state) => state.user.user);
  const trainer = useSelector((state) => state.trainer.trainer);
  const admin = useSelector((state) => state.admin.admin);

  // useEffect(()=>{
  //   const currentUser = user || trainer || admin;

  //   if (currentUser && window.location.pathname === '/') {
  //     // If there's a persisted user state, redirect to their dashboard
  //     navigate(`/${currentUser.role}/dashboard`);
  //   }else if (!currentUser && location.pathname !== '/') {
  //     // If logged out, send the user back to the homepage
  //     navigate('/');
  //   }
  // }, [user, trainer, admin, navigate,location]);





  return (
   <>
   <ScrollToTop/>
    {/* <div className='flex flex-col min-h-screen bg-[url("/fit18.jpg")] bg-cover bg-center'>  */}
     <div className='flex flex-col min-h-screen bg-black-bg-cover bg-center'>  
        <Header/>
      <div  className=' flex-grow p-3 items-center justify-center min-h-screen text-white' > 
        <Outlet/> 
        </div>
      <Footer/>
        </div>
        </>

  )
}

