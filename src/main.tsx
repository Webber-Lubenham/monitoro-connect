import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { supabase } from './lib/supabase.ts';
import './index.css';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Initialize Supabase auth listener
supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
  if (event === 'SIGNED_OUT') {
    localStorage.clear(); // Clear all storage on sign out
  }
});

const basename = (import.meta as any).env.BASE_URL;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
