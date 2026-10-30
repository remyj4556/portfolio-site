import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { projects } from './content/projects.ts'

if (import.meta.env.DEV) {
  const seen = new Set<string>()
  for (const { id } of projects) {
    if (!/^[a-z0-9-]+$/.test(id)) {
      throw new Error(`Project id "${id}" is invalid: use only lowercase letters, digits, and hyphens.`)
    }
    if (seen.has(id)) {
      throw new Error(`Project id "${id}" is used more than once: ids must be unique.`)
    }
    seen.add(id)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
