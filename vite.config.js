import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Apsolutni put — sajt je na sopstvenom domenu (lenscapers.rs) na rootu.
  // Mora "/" (ne "./") da bi asseti radili i sa podstranica
  // tipa /portreti-beograd/ koje generiše prerender.
  base: "/",
  plugins: [react()],
})
