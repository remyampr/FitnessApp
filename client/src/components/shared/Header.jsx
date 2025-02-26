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

const user=useSelector((state)=>state.user);
const trainer = useSelector((state) => state.trainer.trainer);
const admin = useSelector((state) => state.admin.admin);

const currentUser = user.user || trainer || admin;


const handleLogout=async ()=>{
  console.log(" inside logout handle currentuser 1 :",currentUser);
  
  try {
   await userLogout().then((res)=>{

     
      dispatch(clearUser());
      // dispatch(clearTrainer());
      // dispatch(clearAdmin());
      // const handlePurge = async () => {
      //   await persistor.purge();
      // };
      
      // handlePurge();
      console.log(" inside logout handle currentuser 2 :",currentUser);

      persistor.purge();
      sessionStorage.clear();  
      localStorage.clear(); 
      console.log(" inside logout handle currentuser 3 :",currentUser);


      navigate("/")
    })
    
  } catch (err) {
    console.log(err);
  }
}



  return (

//<div className="navbar bg-transparent border-none shadow-none rounded-lg flex justify-between items-center px-9">
<div className="navbar bg-transparent backdrop-blur-sm  `user.user`border-none shadow-none rounded-lg flex justify-between items-center px-9">
  <Link to={currentUser && Object.keys(currentUser).length > 0  ? `/${currentUser.role}/dashboard` : "/"}className="btn btn-ghost text-xl  mx-auto">FitIt</Link>
  <div className="navbar-end flex items-center space-x-4">
    {/* { user.user ?  <div className='flex items-center space-x-3'><span>{user.user.name}</span> 
      <button className='btn' onClick={handleLogout}>Logout</button>   </div> : <span></span> } */}
          {currentUser && Object.keys(currentUser).length > 0 ?
        (<div className='flex items-center space-x-3'>
          <span>{currentUser.name}</span>
          <button className='btn' onClick={handleLogout}>Logout</button>
        </div>) : <span></span>
      }


         <DarkMode/>
     </div>
</div>

  

  )
}
