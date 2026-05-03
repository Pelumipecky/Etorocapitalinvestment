import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import '../styles.css'
// IcoFont Icons
import 'icofont/dist/icofont.min.css'
// i18n
import './i18n'
import ErrorBoundary from './components/ErrorBoundary'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

console.log('🚀 React app starting...')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>
)

console.log('✅ React app rendered')
