import { createBrowserRouter, Navigate } from "react-router-dom";
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
import { PendingTrainers } from "../pages/admin/PendingTrainers";
import { AppointmentsPage } from "../pages/admin/AppointmentsPage";
import { RevenuePage } from "../pages/admin/RevenuePage";
import { WorkoutPage } from "../pages/admin/WorkoutPage";
import { NutritionPage } from "../pages/admin/NutritionPage";
import { WorkoutStartPage } from "../pages/user/WorkoutPage";
import { UserProgressPage } from "../pages/user/UserProgressPage";
import { NutritionPlanPage } from "../pages/user/NutritionPlanPage";
import { UserProfilePage } from "../pages/user/UserProfilePage";
import { UserTrainerPage } from "../pages/user/UserTrainerPage";
import { UserAppointmentPage } from "../pages/user/UserAppointmentPage";
import { TrainerAppointmentsPage } from "../pages/trainer/TrainerAppointmentsPage";
import { TrainerClientsPage } from "../pages/trainer/TrainerClinentsPage";
import { TrainerWorkoutPage } from "../pages/trainer/TrainerWorkoutPage";
import { TrainerNutritionPage } from "../pages/trainer/TrainerNutritionPage";
import { NutritionListPage } from "../pages/user/NutritionListPage";
import { WorkoutListPage } from "../pages/user/WorkoutListPage";
import { TrainerProfilePage } from "../pages/trainer/TrainerProfilePage";
import { TrainerRevenuePage } from "../pages/trainer/TrainerRevenuePage";
import { AdminAuthLayout } from "../layout/AdminAuthLayout";
import { TrainersListingPage } from "../pages/shared/TrainersListingPage";
import { PricingPage } from "../pages/shared/PricingPage";
import { ErrorPage } from "../pages/shared/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Navigate to="/" replace />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "our-trainers",
        element: <TrainersListingPage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "/user/signup",
        element: <UserSignupPage />,
      },
      {
        path: "/user/login",
        element: <UserLoginPage />,
      },
      {
        path: "/trainer/login",
        element: <TrainerLoginPage />,
      },
      {
        path: "/trainer/signup",
        element: <TrainerSignupPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    errorElement: <h1>Error page</h1>,
    children: [
      {
        path: "complete-profile",
        element: <CompleteProfile />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "dashboard",
        element: <UserDashboard />,
      },
      {
        path: "profile",
        element: <UserProfilePage />,
      },
      {
        path: "mytrainer",
        element: <UserTrainerPage />,
      },
      {
        path: "workout/start",
        element: <WorkoutStartPage />,
      },
      {
        path: "nutrition/plan",
        element: <NutritionPlanPage />,
      },
      {
        path: "nutrition",
        element: <NutritionListPage />,
      },
      {
        path: "workouts",
        element: <WorkoutListPage />,
      },
      {
        path: "progress",
        element: <UserProgressPage />,
      },
      {
        path: "appointments",
        element: <UserAppointmentPage />,
      },
    ],
  },
  {
    path: "/trainer",
    element: <TrainerLayout />,
    errorElement: <h1>Error page</h1>,
    children: [
      {
        path: "pending-approval",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <PendingApproval />
          </TrainerProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <TrainerDashboard />
          </TrainerProtectedRoute>
        ),
      },
      {
        path: "clients",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <TrainerClientsPage />
          </TrainerProtectedRoute>
        ),
      },
      {
        path: "appointments",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <TrainerAppointmentsPage />
          </TrainerProtectedRoute>
        ),
      },
      {
        path: "workouts",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <TrainerWorkoutPage />
          </TrainerProtectedRoute>
        ),
      },
      {
        path: "nutrition",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <TrainerNutritionPage />
          </TrainerProtectedRoute>
        ),
      },
      {
        path: "revenue",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <TrainerRevenuePage />
          </TrainerProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <TrainerProtectedRoute requiredRole="trainer">
            <TrainerProfilePage />
          </TrainerProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <h1>Error page</h1>,
    children: [
      // {
      //   path: "login",
      //   element: <AdminLoginPage />,
      // },
      // {
      //   path: "forgot-password",
      //   element: <AdminForgotPassword />,
      // },
      {
        path: "dashboard",
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <AdminProtectedRoute>
            <AdminTrainersUsersPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "trainers",
        element: (
          <AdminProtectedRoute>
            <AdminTrainersUsersPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "approvals",
        element: (
          <AdminProtectedRoute>
            <PendingTrainers />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "appointments",
        element: (
          <AdminProtectedRoute>
            <AppointmentsPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "revenue",
        element: (
          <AdminProtectedRoute>
            <RevenuePage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "workouts",
        element: (
          <AdminProtectedRoute>
            <WorkoutPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "nutrition",
        element: (
          <AdminProtectedRoute>
            <NutritionPage />
          </AdminProtectedRoute>
        ),
      },

      // admin routes
    ],
  },

  {
    path: "/admin",
    element: <AdminAuthLayout />, // ✅ Now AuthLayout is applied properly
    children: [
      { path: "login", element: <AdminLoginPage /> },
      { path: "forgot-password", element: <AdminForgotPassword /> },
    ],
  },
]);
