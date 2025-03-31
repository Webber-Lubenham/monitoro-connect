<<<<<<< HEAD

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
        '*.lovableproject.com'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    allowedHosts: [
      'localhost',
      'gptengineer.app', 
      'lovable.dev',
      '*.lovableproject.com',
      'dafa1ef1-0d8f-4477-84d6-e6cfd55de1a0.lovableproject.com'
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
=======
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
  },
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
>>>>>>> helper/main
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  // Added build configuration
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}));
=======
  server: {
    // @ts-ignore
    allowedHosts: true,
  }
});
>>>>>>> helper/main
