import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // 👇 Adicione esta seção
  preview: {
    allowedHosts: [
      'portal-de-entrada-662788552627.us-central1.run.app'
    ]
  }
})