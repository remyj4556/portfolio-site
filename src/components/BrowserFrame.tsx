import type { Project } from '../content/types.ts'
import styles from './BrowserFrame.module.css'

type Props = { project: Project; onClick: () => void }

// Mouse convenience only: the frame toggles the card but is not focusable;
// the header button is the accessible control.
export function BrowserFrame({ project, onClick }: Props) {
  return (
    <div className={styles.frame} onClick={onClick}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        {project.displayUrl && <span className={styles.url}>{project.displayUrl}</span>}
      </div>
      <div className={styles.screen}>
        {project.image ? (
          <img src={project.image.src} alt={project.image.alt} width={1200} height={750} loading="lazy" />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            {project.title}
          </div>
        )}
      </div>
    </div>
  )
}
