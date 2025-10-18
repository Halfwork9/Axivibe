import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ✅ FIX: Explicitly tell Vite to include and pre-bundle this dependency.
  // This helps the build process find the package correctly.
  optimizeDeps: {
    include: ['@react-oauth/google'],
  },
})

