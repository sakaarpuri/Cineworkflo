import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Fix for stale cached chunks after deploy:
// If a user has an old HTML shell but navigates to a route that needs a new lazy-loaded chunk,
// the dynamic import can fail and the page looks "blank". Reload once to fetch the latest build.
const shouldReloadForChunkError = (reason) => {
  const message = String(reason?.message || reason || '')
  return (
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('Loading chunk') ||
    message.includes('ChunkLoadError')
  )
}

window.addEventListener('unhandledrejection', (event) => {
  if (!shouldReloadForChunkError(event?.reason)) return
  const key = 'cwf_chunk_reload_once'
  if (sessionStorage.getItem(key) === '1') return
  sessionStorage.setItem(key, '1')
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
