import { Navigate } from 'react-router-dom';
import { LoginPage } from "./pages/auth/Login"; 
import { RegisterPage } from "./pages/auth/Register"; 
import { DashboardPage } from "./pages/Dashboard"; 
import { ProfilePage } from "./pages/Profile"; 

export const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/dashboard",
    element: <DashboardPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />
  }
];
