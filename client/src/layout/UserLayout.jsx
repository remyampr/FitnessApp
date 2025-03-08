import React from 'react'
import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { Navbar } from '../components/shared/Navbar'
import { UserSidebar } from '../components/user/UserSidebar'
import { UserNavbar } from '../components/user/UserNavbar'

export const UserLayout = () => {
  return (
      <>
      <ScrollToTop/>
      <UserNavbar/>
   
    {/* <Navbar/> */}
    <Outlet/>
    </>
    )
}
