
<<<<<<< HEAD
import React from "react"
import { Toaster } from "./components/ui/sonner.tsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout } from "./components/layouts/auth-layout.tsx"
import { LoginPage } from "./pages/auth/Login.tsx"
import { RegisterPage } from "./pages/auth/register.tsx"
import { ParentRegisterPage } from "./pages/auth/register/parent.tsx"
import { StudentRegisterPage } from "./pages/auth/register/student.tsx"

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/parent" element={<ParentRegisterPage />} />
            <Route path="/register/student" element={<StudentRegisterPage />} />
          </Route>
        </Routes>
      </main>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
=======
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Guardians from "./pages/Guardians";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Location from "./pages/Location";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import EmailVerification from "./pages/auth/EmailVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/cadastro" element={<Signup />} />
            <Route path="/auth/verificar" element={<EmailVerification />} />
            
            {/* Protected App Routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/responsaveis" element={<Guardians />} />
              <Route path="/notificacoes" element={<Notifications />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="/localizacao" element={<Location />} />
              <Route path="/privacidade" element={<Privacy />} />
            </Route>
            
            {/* Redirect root to auth if not logged in */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
>>>>>>> 59fa2df9b473179f8b5f5f6110562924f0d12d36
