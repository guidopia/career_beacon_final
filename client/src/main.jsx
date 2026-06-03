import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.tsx'; // Import ThemeProvider
import { AccessProvider } from './state/access/AccessContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AccessProvider>
        <App />
      </AccessProvider>
    </ThemeProvider>
  </StrictMode>,
)
