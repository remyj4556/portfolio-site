import { Analytics } from '@vercel/analytics/react'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { Projects } from './components/Projects.tsx'
import { CaseStudy } from './components/CaseStudy.tsx'
import { Activity } from './components/Activity.tsx'
import { Footer } from './components/Footer.tsx'

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Projects />
        <CaseStudy />
        <Activity />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}
