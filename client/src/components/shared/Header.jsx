import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DarkMode } from '../shared/DarkMode'

export const Header = () => {

  const navigate=useNavigate();
  return (

//<div className="navbar bg-transparent border-none shadow-none rounded-lg flex justify-between items-center px-9">
<div className="navbar bg-transparent backdrop-blur-sm border-none shadow-none rounded-lg flex justify-between items-center px-9">
  <Link to={"/"} className="btn btn-ghost text-xl  mx-auto">FitIt</Link>
  <div className="navbar-end flex items-center space-x-4">
      {/* <a className="btn">JoinUS</a> */}
         <DarkMode/>
     </div>
</div>

  

  )
}
