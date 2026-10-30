import { useState, useSyncExternalStore } from 'react'
import { site } from '../content/site.ts'
import { githubUrl } from '../content/derived.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { GitHubIcon, LinkedInIcon } from './icons.tsx'
import { MatrixRain } from './MatrixRain.tsx'
import { MotionToggle } from './MotionToggle.tsx'
import { TypedText } from './TypedText.tsx'
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

export function Hero() {
  const reducedMotion = useReducedMotion()
  // Per page load; survives reduced-motion changes.
  const [paused, setPaused] = useState(false)

  return (
    <section id="top" className={styles.hero}>
      <div className={`container ${styles.content}`}>
        {!reducedMotion && (
          <div className={styles.toggle}>
            <MotionToggle paused={paused} onToggle={() => setPaused((value) => !value)} />
          </div>
        )}

        <p className={styles.label}>Hi, my name is</p>
        <h1 className={styles.name}>{site.name}</h1>
        <p className={styles.role}>{site.role}</p>
        <TypedText phrases={site.typedPhrases} paused={paused} reducedMotion={reducedMotion} className={styles.typed} />
        <p className={styles.intro}>{site.intro}</p>

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
      </div>

      {!reducedMotion && <MatrixRain running={!paused} />}
    </section>
  )
}
