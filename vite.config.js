import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    chunkSizeWarningLimit: 2000, // Növeljük a limitet, mert egy fájl lesz minden
  },
})
