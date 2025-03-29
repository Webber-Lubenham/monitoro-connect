
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
