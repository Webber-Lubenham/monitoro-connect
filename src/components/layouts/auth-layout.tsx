import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block bg-muted" />
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}