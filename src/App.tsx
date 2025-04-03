
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { supabaseUrl, supabaseAnonKey } from "./integrations/supabase/config";
import { AuthProvider } from "./providers/AuthProvider";

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
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
