import { StrictMode } from 'react'
import { flushSync } from 'react-dom'
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

flushSync(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

// The layout kit enhances elements by class and data attribute (menu, effect, scroll moment), so it
// loads once, after React has put those elements in the page. Imported at runtime from public/assets.
const kit = (path: string) => import(/* @vite-ignore */ `/assets/${path}`)
void Promise.all([kit('system.js'), kit('motion/motion.js'), kit('layout/layout.js')])
