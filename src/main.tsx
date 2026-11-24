import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/app'
import { makeServer } from '@/mocks/server'

// Start the in-browser mock API in development or in the Docker showcase image.
if (import.meta.env.DEV || import.meta.env.VITE_MOCK_API === 'true') {
  makeServer()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
