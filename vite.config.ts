// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Optional: Configure the server port if needed
    // server: {
    //   port: 3000, // Default is 5173
    // },
    // Optional: Configure the build output directory if you don't want 'dist'
    // build: {
    //   outDir: 'build',
    // },
    // Optional: Define global constants like process.env (use import.meta.env instead where possible)
    // define: {
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // }
});