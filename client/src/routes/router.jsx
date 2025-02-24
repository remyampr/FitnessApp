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
import { ProtectedRoute } from "../components/shared/ProtectedRoute/ProtectedRoute";
import { TrainerLayout } from "../layout/TrainerLayout";
import { PendingApproval } from "../pages/trainer/PendingApproval";
import { TrainerDashboard } from "../pages/trainer/TrainerDashboard";


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
            <ProtectedRoute requiredRole="trainer">
                <PendingApproval/>
            </ProtectedRoute>
          )
           
        },    
        {
            path:"dashboard",
            element:(
              <ProtectedRoute requiredRole="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
            )
        },
        
      ]
    },
  ]);