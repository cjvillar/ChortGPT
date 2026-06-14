import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  base: '/ChortGPT/',
  plugins: [
    react(),
    tailwindcss(),
    obfuscatorPlugin({
      apply: 'build',        // only runs on npm run build, not dev
      exclude: [/node_modules/],
      options: {
        stringArray: true,           // pulls strings out into a hidden array
        stringArrayEncoding: ['base64'],  
        stringArrayThreshold: 0.75,
        identifierNamesGenerator: 'hexadecimal', 
        splitStrings: true,         
        splitStringsChunkLength: 5,
        selfDefending: false, 
      },
    }),
  ],
})