
import { Navigate } from 'react-router-dom';
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/register";
import Dashboard from "./pages/Dashboard";
import { ProfilePage } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ParentDashboard from "./pages/ParentDashboard";
import StudentProfile from "./pages/StudentProfile";
import Confirm from "./pages/Confirm";
import EmailTester from "./pages/EmailTester";
import NotificationPreferences from "./pages/NotificationPreferences";
import ResetPassword from './pages/ResetPassword';
import TestGuardianInvite from "./pages/TestGuardianInvite";
import GuardianConfirm from "./pages/GuardianConfirm";
import Activate from "./pages/Activate";
import RootLayout from "./components/RootLayout";
import RequireAuth from "./components/auth/RequireAuth";
import Index from "./pages/Index";
import App from "./App";

export const routes = [
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Index />
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
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        )
      },
      {
        path: "/parent-dashboard",
        element: (
          <RequireAuth>
            <ParentDashboard />
          </RequireAuth>
        )
      },
      {
        path: "/profile",
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        )
      },
      {
        path: "/student-profile",
        element: (
          <RequireAuth>
            <StudentProfile />
          </RequireAuth>
        )
      },
      {
        path: "/confirm",
        element: <Confirm />
      },
      {
        path: "/reset-password",
        element: <ResetPassword />
      },
      {
        path: "/email-tester",
        element: <EmailTester />
      },
      {
        path: "/notification-preferences",
        element: (
          <RequireAuth>
            <NotificationPreferences />
          </RequireAuth>
        )
      },
      {
        path: "/test-guardian-invite",
        element: <TestGuardianInvite />
      },
      {
        path: "/guardian-confirm",
        element: <GuardianConfirm />
      },
      {
        path: "/auth/activate",
        element: <Activate />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
];
