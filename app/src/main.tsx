import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Restore the path GitHub Pages' 404.html stashed before React Router mounts
// (see /404.html at the repo root — GitHub Pages has no server-side router).
const redirect = sessionStorage.getItem('pma_redirect')
if (redirect) {
  sessionStorage.removeItem('pma_redirect')
  window.history.replaceState(null, '', '/app' + redirect)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
