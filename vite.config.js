import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'e4bedefd-9d66-48b7-970b-08487a34850c.lovableproject.com'
    ]
  }
});
