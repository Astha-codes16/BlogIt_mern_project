
import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext.jsx'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppProvider>
    <App />
    </AppProvider>
  </BrowserRouter>,
)
