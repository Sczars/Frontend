import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App'

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found. Make sure <div id="root"></div> exists in your index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
