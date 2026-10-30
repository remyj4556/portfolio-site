import { Analytics } from '@vercel/analytics/react'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { Projects } from './components/Projects.tsx'
import { Activity } from './components/Activity.tsx'
import { Contact } from './components/Contact.tsx'
import { Footer } from './components/Footer.tsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects />
        <Activity />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}
