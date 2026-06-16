import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // relativan put — radi i na GitHub Pages (username.github.io/repo/)
  // i kasnije na sopstvenom domenu lenscape.rs bez ikakve izmene.
  base: "./",
  plugins: [react()],
})
