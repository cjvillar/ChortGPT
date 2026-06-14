import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  base: '/ChortGPT/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})