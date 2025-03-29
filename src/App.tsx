
import React from "react"
import { Toaster } from "./components/ui/sonner.tsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { StudentRegisterPage } from "./pages/auth/register/student.tsx"
import { LoginPage } from "./pages/auth/Login.tsx"
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx"
import { AppLayout } from "./components/layout/AppLayout.tsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register/student" element={<StudentRegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
