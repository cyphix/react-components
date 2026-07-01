import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App.tsx'
import { makeServer } from '@/mocks/server'

// Start the in-browser mock API in development.
if (import.meta.env.DEV) {
  makeServer()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
