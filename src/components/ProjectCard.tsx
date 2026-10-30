import { useState } from 'react'
import type { Project } from '../content/types.ts'
import { BrowserFrame } from './BrowserFrame.tsx'
import { ExternalLink } from './ExternalLink.tsx'
import { ExternalIcon, GitHubIcon } from './icons.tsx'
import styles from './ProjectCard.module.css'

type Props = { project: Project; index: number }

export function ProjectCard({ project, index }: Props) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((value) => !value)
  const detailsId = `project-${project.id}-details`
  const { source, demo } = project.links ?? {}

  return (
    <article className={styles.card}>
      <BrowserFrame project={project} onClick={toggle} />

      <div className={styles.body}>
        <h3 className={styles.title}>
          <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={detailsId} onClick={toggle}>
            <span className={styles.index}>{String(index).padStart(2, '0')}</span>
            <span className={styles.titleText}>{project.title}</span>
            <span className={styles.indicator} aria-hidden="true">
              {open ? '[−]' : '[+]'}
            </span>
          </button>
        </h3>

        <p className={styles.summary}>{project.summary}</p>

        <ul className={styles.tags}>
          {project.tech.map((tech) => (
            <li key={tech} className={styles.tag}>
              {tech}
            </li>
          ))}
        </ul>

        <div id={detailsId} className={`${styles.details} ${open ? styles.open : ''}`}>
          <div className={styles.detailsInner} inert={!open}>
            <div className={styles.detailsContent}>
              <h4 className={styles.detailHeading}>Problem</h4>
              <p>{project.problem}</p>

              <h4 className={styles.detailHeading}>My contribution</h4>
              <p>{project.contribution}</p>

              <h4 className={styles.detailHeading}>Outcome</h4>
              <p>{project.outcome}</p>

              {project.highlights && project.highlights.length > 0 && (
                <>
                  <h4 className={styles.detailHeading}>Highlights</h4>
                  <ul className={styles.highlights}>
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </>
              )}

              {(source || demo) && (
                <ul className={styles.links}>
                  {source && (
                    <li>
                      <ExternalLink href={source} className={styles.link}>
                        <GitHubIcon />
                        Source (GitHub)
                      </ExternalLink>
                    </li>
                  )}
                  {demo && (
                    <li>
                      <ExternalLink href={demo} className={styles.link}>
                        <ExternalIcon />
                        Live demo
                      </ExternalLink>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
