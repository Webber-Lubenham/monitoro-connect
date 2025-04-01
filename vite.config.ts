
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: 'localhost',
    port: 8080,
    strictPort: true,
    https: false, // Disable HTTPS for local development
    cors: {
      origin: [
        'https://gptengineer.app',
        'https://lovable.dev',
        'http://localhost:8080',
        '*.lovableproject.com',
        'https://monitoro-connect.lovable.app',
        'https://sistema-monitore.com.br',
        'https://4629cb7d-b3ba-4d33-8157-8ad16626160e-00-2q62t3fp8p2fl.riker.replit.dev:5000', // Add Replit domain
        'https://*.replit.dev', // Add wildcard for all Replit domains
        'https://*.riker.replit.dev', // Add wildcard for all Riker Replit domains
        'https://*.lovable.app', // Add wildcard for Lovable domains
        '*' // Allow all origins as a fallback
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Info', 'Apikey', 'X-Application-Name', 'Origin'],
      credentials: true
    },
    allowedHosts: [
      'localhost',
      'gptengineer.app', 
      'lovable.dev',
      '*.lovableproject.com',
      'dafa1ef1-0d8f-4477-84d6-e6cfd55de1a0.lovableproject.com',
      'monitoro-connect.lovable.app',
      'sistema-monitore.com.br',
      '*.replit.dev', // Add wildcard for all Replit domains
      '*.riker.replit.dev', // Add wildcard for all Riker Replit domains
      '*.lovable.app', // Add wildcard for Lovable domains
      '*' // Allow all hosts as a fallback
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Added build configuration
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}));
