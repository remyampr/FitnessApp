import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DarkMode } from '../shared/DarkMode'
import { useDispatch, useSelector } from 'react-redux';
import { persistor } from '../../redux/store';
import { clearUser, logout } from '../../redux/features/userSlice';
import { userLogout } from '../../services/userServices';

export const Header = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch()

const userData=useSelector((state)=>state.user);

const handleLogout=()=>{
  try {
    userLogout().then((res)=>{
      persistor.purge();
      dispatch(clearUser());
      navigate("/")
    })
    
  } catch (err) {
    console.log(err);
  }
}



  return (

//<div className="navbar bg-transparent border-none shadow-none rounded-lg flex justify-between items-center px-9">
<div className="navbar bg-transparent backdrop-blur-sm border-none shadow-none rounded-lg flex justify-between items-center px-9">
  <Link to={"/"} className="btn btn-ghost text-xl  mx-auto">FitIt</Link>
  <div className="navbar-end flex items-center space-x-4">
      {/* <a className="btn">JoinUS</a> */}
    { userData.user ?  <div className='flex items-center space-x-3'><span>{userData.user.name}</span> 
      <button className='btn' onClick={handleLogout}>Logout</button>   </div> : <span></span> }


         <DarkMode/>
     </div>
</div>

  

  )
}
