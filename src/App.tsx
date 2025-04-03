
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ParentDashboard from "./pages/ParentDashboard";
import StudentProfile from "./pages/StudentProfile";
import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import Confirm from "./pages/Confirm";
import EmailTester from "./pages/EmailTester";
import NotificationPreferences from "./pages/NotificationPreferences";
import ResetPassword from './pages/ResetPassword';
import { AlertTriangle } from "lucide-react";
import TestGuardianInvite from "./pages/TestGuardianInvite";
import GuardianConfirm from "./pages/GuardianConfirm";
import Activate from "./pages/Activate";
import { supabaseUrl, supabaseAnonKey } from "./integrations/supabase/config";
import { AuthProvider } from "./providers/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  // Log the environment to help with debugging
  useEffect(() => {
    console.log("Environment: ", import.meta.env.MODE);
    console.log("Supabase URL: ", supabaseUrl?.substring(0, 10) + "...");
    // Only log that the API key exists, not the actual key
    console.log("Supabase Anon Key: ", supabaseAnonKey ? "Configurado" : "Não configurado");
    console.log("Mapbox Token: ", import.meta.env.VITE_MAPBOX_TOKEN ? "Configurado" : "Não configurado");
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {/* Ferramenta de diagnóstico flutuante */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="/email-tester"
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-full shadow-lg transition-colors"
          >
            <AlertTriangle className="h-5 w-5" />
            <span className="hidden md:inline">Diagnóstico de Email</span>
          </a>
        </div>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/parent-dashboard" 
            element={
              <RequireAuth>
                <ParentDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <RequireAuth>
                <StudentProfile />
              </RequireAuth>
            } 
          />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-tester" element={<EmailTester />} />
          <Route 
            path="/notification-preferences" 
            element={
              <RequireAuth>
                <NotificationPreferences />
              </RequireAuth>
            } 
          />
          <Route path="/test-guardian-invite" element={<TestGuardianInvite />} />
          <Route path="/guardian-confirm" element={<GuardianConfirm />} />
          <Route path="/auth/activate" element={<Activate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner position="bottom-center" />
      </div>
    </AuthProvider>
  );
}

export default App;
