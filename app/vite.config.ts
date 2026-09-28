import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built app works at any mount depth (GitHub Pages
  // project sites serve from /<repo>/app/, not the domain root). The app is
  // always first loaded from its own index.html (see 404.html's redirect),
  // so asset paths only ever need to resolve relative to that one document.
  base: './',
  plugins: [react(), tailwindcss()],
})
