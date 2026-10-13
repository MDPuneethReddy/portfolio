import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Output to /build so existing hosting config (from the CRA days) keeps working.
// REACT_APP_ prefix kept so the existing Formspree env var still works.
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  build: { outDir: 'build' },
})
