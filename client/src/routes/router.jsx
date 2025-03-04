import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";


import { HomePage } from "../pages/shared/HomePage";
import { UserLoginPage } from "../pages/user/UserLoginPage";
import { UserSignupPage } from "../pages/user/UserSignupPage";
import { TrainerLoginPage } from "../pages/trainer/TrainerLoginPage";
import { TrainerSignupPage } from "../pages/trainer/TrainerSignupPage";
import { UserDashboard } from "../pages/user/UserDashboard";
import { UserLayout } from "../layout/UserLayout";
import { CompleteProfile } from "../pages/user/CompleteProfile";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { TrainerLayout } from "../layout/TrainerLayout";
import { PendingApproval } from "../pages/trainer/PendingApproval";
import { TrainerDashboard } from "../pages/trainer/TrainerDashboard";
import { AdminLayout } from "../layout/AdminLayout";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminForgotPassword } from "../pages/admin/AdminForgotPassword";
import { AdminProtectedRoute } from "../components/ProtectedRoute/AdminProtectedRoute";
import { AdminTrainersUsersPage } from "../pages/admin/AdminTrainersUsersPage";
import { TrainerProtectedRoute } from "../components/ProtectedRoute/TrainerProtectedRoute";
import { ForgotPassword } from "../pages/shared/ForgotPassword";
import { PaymentSuccess } from "../pages/user/PaymentSuccess";


export const router = createBrowserRouter([
    {
      path: "/",
      element:<MainLayout/> ,
      errorElement:<h1>Error page</h1>,
      children:[
    
        {
            path:"/",
            element:<HomePage/>
        },
        {
            path:"/user/signup",
            element:<UserSignupPage/>
        },
        {
            path:"/user/login",
            element:<UserLoginPage/>
        },
        {
            path:"/trainer/login",
            element:<TrainerLoginPage/>
        },
        {
            path:"/trainer/signup",
            element:<TrainerSignupPage/>
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword/>,
        },

      ]
    },
    {
      path: "/user",
      element:<UserLayout/> ,
      errorElement:<h1>Error page</h1>,
      children:[
        {
          path: "complete-profile",
          element:(
            <ProtectedRoute requiredRole="user" allowIncomplete={true}>
                <CompleteProfile/>
            </ProtectedRoute>
          )
           
        },    
        {
          path: "payment-success",
          element:(
            <ProtectedRoute requiredRole="user" >
                <PaymentSuccess/>
            </ProtectedRoute>
          )
           
        },    
        {
            path:"dashboard",
            element:(
              <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
            )
        },
        
      ]
    },
    {
      path: "/trainer",
      element:<TrainerLayout/> ,
      errorElement:<h1>Error page</h1>,
      children:[
        {
          path: "pending-approval",
          element:(
            <TrainerProtectedRoute requiredRole="trainer">
                <PendingApproval/>
            </TrainerProtectedRoute>
          )
           
        },    
        {
            path:"dashboard",
            element:(
              <TrainerProtectedRoute requiredRole="trainer">
            <TrainerDashboard/>
            </TrainerProtectedRoute>
            )
        },
        // {
        //     path:"dashboard",
        //     element:(
        //       <TrainerProtectedRoute requiredRole="trainer">
        //       <TrainerDashboard />
        //     </TrainerProtectedRoute>
        //     )
        // },
        
      ]
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      errorElement: <h1>Error page</h1>,
      children: [
        {
          path: "login",
          element: <AdminLoginPage />
        },
        {
          path: "forgot-password",
          element: <AdminForgotPassword />
        },
        {
          path: "dashboard",
          element: (
           <AdminProtectedRoute>
              <AdminDashboard />
              </AdminProtectedRoute>
            
          )
        },
        {
          path: "users",
          element: (
           <AdminProtectedRoute>
              <AdminTrainersUsersPage />
              </AdminProtectedRoute>
            
          )
        },
      
        // admin routes 
      ]
    },
  ]);