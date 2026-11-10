import { site } from '../content/site.ts'
import { MotionToggle } from './MotionToggle.tsx'
import { TypedText } from './TypedText.tsx'
import styles from './HeroTerminal.module.css'

type Props = { paused: boolean; reducedMotion: boolean; onToggle: () => void }

// The hero's terminal window (DESIGN.md §4.2.2). Mostly decorative: the dots, title and the
// echoed name and role are hidden from assistive tech (the left column already says them); the
// intro is real text, the typed phrase carries its own visually-hidden copy, and the pause control
// sits in the title bar, before the moving line. Its border is the one animated gradient; the same
// pause control stops it (paused) and reduced motion leaves it still.
export function HeroTerminal({ paused, reducedMotion, onToggle }: Props) {
  return (
    <div className={`${styles.window} ${paused ? styles.paused : ''} ${reducedMotion ? styles.still : ''}`}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.title} aria-hidden="true">
          {site.firstName.toLowerCase()}@portfolio: ~
        </span>
        {!reducedMotion && <MotionToggle paused={paused} onToggle={onToggle} />}
      </div>
      <div className={styles.body}>
        <p className={styles.command} aria-hidden="true">
          <span className={styles.prompt}>$</span> whoami
        </p>
        <p className={styles.output} aria-hidden="true">
          {site.name}
        </p>

        <p className={styles.command} aria-hidden="true">
          <span className={styles.prompt}>$</span> cat role.txt
        </p>
        <p className={styles.output} aria-hidden="true">
          {site.role}
        </p>

        <p className={styles.command} aria-hidden="true">
          <span className={styles.prompt}>$</span> cat intro.txt
        </p>
        <p className={styles.output}>{site.intro}</p>

        <div className={styles.command}>
          <span className={styles.prompt} aria-hidden="true">
            $
          </span>
          <TypedText phrases={site.typedPhrases} paused={paused} reducedMotion={reducedMotion} className={styles.typed} />
        </div>
      </div>
    </div>
  )
}
