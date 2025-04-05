
import { Routes, Route, Link } from "react-router-dom";
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
    <div className="min-h-screen">
      {/* Ferramenta de diagnóstico flutuante */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          to="/email-tester"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-full shadow-lg transition-colors"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="hidden md:inline">Diagnóstico de Email</span>
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-tester" element={<EmailTester />} />
        <Route path="/notification-preferences" element={<NotificationPreferences />} />
        <Route path="/test-guardian-invite" element={<TestGuardianInvite />} />
        <Route path="/guardian-confirm" element={<GuardianConfirm />} />
        <Route path="/auth/activate" element={<Activate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner position="bottom-center" />
    </div>
  );
}

export default App;
