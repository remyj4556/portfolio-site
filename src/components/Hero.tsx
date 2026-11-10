import { useState, useSyncExternalStore } from 'react'
import { site } from '../content/site.ts'
import { githubUrl } from '../content/derived.ts'
import { data, totalText } from './contributions.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { GitHubIcon, LinkedInIcon } from './icons.tsx'
import { HeroTerminal } from './HeroTerminal.tsx'
import { VisuallyHidden } from './VisuallyHidden.tsx'
import styles from './Hero.module.css'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// Tracks prefers-reduced-motion live, without a reload.
function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches)
}

// Layout kit "collage" hero: words on the left, the terminal window on a lit ground at the right.
// The ground is the kit's grain-gradient effect, mounted by the kit after render (data-fx).
export function Hero() {
  const reducedMotion = useReducedMotion()
  // Per page load; survives reduced-motion changes.
  const [paused, setPaused] = useState(false)

  return (
    <section id="top" className="hero hero--collage" data-enter aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-text grid hero__grid">
          <div className="hero__text span-5">
            <h1 id="hero-h">{site.name}</h1>
            <p className="hero__lead">{site.role}</p>

            <div className="btn-row">
              <a className="btn btn--primary" href="#projects">
                View projects
              </a>
              <a className="btn btn--secondary" href={`mailto:${site.email}`}>
                Email me
              </a>
            </div>

            <ul className={styles.icons}>
              <li>
                <ExternalLink href={githubUrl} className={styles.iconLink}>
                  <GitHubIcon size={28} />
                  <VisuallyHidden>GitHub</VisuallyHidden>
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={site.linkedinUrl} className={styles.iconLink}>
                  <LinkedInIcon size={28} />
                  <VisuallyHidden>LinkedIn</VisuallyHidden>
                </ExternalLink>
              </li>
            </ul>

            {data.status === 'ok' && <p className={styles.proof}>{totalText(data.total)}</p>}
          </div>

          <div
            className={`hero__art span-6 start-7 ${styles.art}`}
            data-fx="grain-gradient"
            data-fx-seed="7"
            data-fx-params='{"speed":0.8,"grainMotion":0}'
          >
            <div className="ly-piece ly-piece--main">
              <HeroTerminal paused={paused} reducedMotion={reducedMotion} onToggle={() => setPaused((value) => !value)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
