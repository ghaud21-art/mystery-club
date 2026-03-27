import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './murder_mystery_v4.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
