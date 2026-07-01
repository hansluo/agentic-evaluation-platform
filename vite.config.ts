import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 46369,
    allowedHosts: ['.preview.with.woa.com', '.devnet-preview.with.woa.com']
  }
})
