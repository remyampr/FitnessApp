import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { clearUser } from '../../../redux/features/userSlice';
import { clearTrainer } from '../../../redux/features/trainerSlice';
import { clearAdmin } from '../../../redux/features/adminSlice';

export const ProtectedRoute = ({ children, allowIncomplete = false, requiredRole}) => {

  const location=useLocation();
  const dispatch=useDispatch();
  const navigate=useNavigate();

  // Get user states from Redux
  const user=useSelector((state)=> state.user.user);
  const trainer=useSelector((state)=> state.trainer.trainer);
  const admin=useSelector((state)=> state.admin.admin);

  console.log("inside ProtectedRoute  User:", user);
console.log("inside ProtectedRoute  Trainer:", trainer);
console.log("inside ProtectedRoute  Admin:", admin);


  

   // Clear invalid persisted states
   useEffect(()=>{
    console.log('User:', user, 'Trainer:', trainer, 'Admin:', admin);
    if(!user && !trainer && !admin){
      // If no user is logged in, clear any stale Redux state
      dispatch(clearUser());
      dispatch(clearTrainer());
      dispatch(clearAdmin());
    }
   },[dispatch,user,trainer,admin])

     // Determine current authenticated entity
  const currentUser = user || trainer || admin;
  console.log("current user : : ",currentUser);
  

    // If no authenticated user, redirect to appropriate login
    // if (!currentUser || Object.keys(currentUser).length === 0)
    if (!currentUser || !currentUser.role) {
      const loginRoutes = {
        'user': '/user/login',
        'trainer': '/trainer/login',
        'admin': '/admin/login'
      };

console.log("No current user or role found");

const redirectTo = loginRoutes[requiredRole] || "/";

return <Navigate to={redirectTo} replace />;
      // return <Navigate to="/" replace />;
      // return <Navigate to={loginRoutes[requiredRole]} state={{ from: location }} replace />;
    }

      // Check role match
  if (currentUser.role !== requiredRole) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }
  

  // Handle user profile completion
  if (requiredRole === 'user') {
    if (!allowIncomplete && !user.isProfileComplete && 
        location.pathname !== '/user/complete-profile') {
      return <Navigate to="/user/complete-profile" replace />;
    }

    if (user.isProfileComplete && location.pathname === '/user/complete-profile') {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

    // Handle trainer approval
    if (requiredRole === 'trainer') {
      if (!trainer.isApproved && location.pathname !== '/trainer/pending-approval') {
        return <Navigate to="/trainer/pending-approval" replace />;
      }
    }


    return children;
}








// export const ProtectedRoute = ({ children, allowIncomplete = false, requiredRole }) => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get user states from Redux
//   const user = useSelector((state) => state.user.user);
//   const trainer = useSelector((state) => state.trainer.trainer);
//   const admin = useSelector((state) => state.admin.admin.admin);

//   console.log("required Role: ",requiredRole);
  
//   console.log("inside ProtectedRoute: admin", admin); // Check admin state

//   useEffect(() => {
//       console.log('User:', user, 'Trainer:', trainer, 'Admin:', admin);
//       if (!user && !trainer && !admin) {
//           // Clear invalid persisted states
//           dispatch(clearUser());
//           dispatch(clearTrainer());
//           dispatch(clearAdmin());
//           console.log("inside ProtectedRoute after clear admin", admin);
//       }
//   }, [dispatch, user, trainer, admin]);

//   // Determine current authenticated entity
//   const currentUser = user || trainer || admin;
//   console.log("current user : : ", currentUser);

//   // If no authenticated user, redirect to appropriate login
//   if (!currentUser || !currentUser.role) {
//       const loginRoutes = {
//           'user': '/user/login',
//           'trainer': '/trainer/login',
//           'admin': '/admin/login'
//       };

//       console.log("No current user or role found");

//       const redirectTo = loginRoutes[requiredRole] || "/";
//       return <Navigate to={redirectTo} replace />;
//   }

//   // Check role match
//   if (currentUser.role !== requiredRole) {
//       return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
//   }

//   // Handle profile completion for users and approval for trainers
//   if (requiredRole === 'user' && !allowIncomplete && !user.isProfileComplete && location.pathname !== '/user/complete-profile') {
//       return <Navigate to="/user/complete-profile" replace />;
//   }
  
//   if (requiredRole === 'trainer' && !trainer.isApproved && location.pathname !== '/trainer/pending-approval') {
//       return <Navigate to="/trainer/pending-approval" replace />;
//   }

//   return children;
// };
