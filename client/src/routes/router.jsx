import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";


import { HomePage } from "../pages/shared/HomePage";
import { UserLoginPage } from "../pages/user/UserLoginPage";
import { UserSignupPage } from "../pages/user/UserSignupPage";
import { TrainerLoginPage } from "../pages/trainer/TrainerLoginPage";
import { TrainerSignupPage } from "../pages/trainer/TrainerSignupPage";


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
  ]);