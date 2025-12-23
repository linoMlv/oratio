import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Si vous déployez sur https://<user>.github.io/<repo>/, 
  // remplacez './' par '/<repo>/' (ex: '/oratio/')
  base: './', 
})