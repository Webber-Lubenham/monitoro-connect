
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Add a small delay to allow auth state to synchronize
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page but save the current location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
