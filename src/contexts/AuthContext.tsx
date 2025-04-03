
// This file is deprecated and will not be used anymore
// All authentication is now handled through src/providers/AuthProvider.tsx
// This file is kept for backward compatibility but should be removed in future updates

import React, { createContext, useContext } from 'react';
import { useAuth as useAuthProvider } from '../providers/AuthProvider';

const AuthContext = createContext<ReturnType<typeof useAuthProvider> | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
