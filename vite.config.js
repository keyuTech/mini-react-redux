import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.jsx',
      name: 'mini-react-redux',
      fileName: 'mini-react-redux'
    }
  }
})
