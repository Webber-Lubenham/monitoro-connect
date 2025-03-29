
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresGuardian?: boolean;
  requiresStudent?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiresGuardian = false,
  requiresStudent = false 
}: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-monitor-200 border-t-monitor-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If role-specific access is required
  if (profile && ((requiresGuardian && profile.role !== 'guardian') || 
                 (requiresStudent && profile.role !== 'student'))) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
