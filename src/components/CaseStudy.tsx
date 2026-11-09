import { projects } from '../content/projects.ts'
import type { Project } from '../content/types.ts'
import styles from './CaseStudy.module.css'

// The first project told in three steps, held on screen by the kit's "pinned-chapters" moment
// (DESIGN.md §4.3.1). The kit moves the figures into one shared frame after render, so this
// component renders once and never changes.
export function CaseStudy() {
  const project: Project = projects[0]
  const steps = [
    { title: 'Problem', text: project.problem },
    { title: 'My contribution', text: project.contribution },
    { title: 'Outcome', text: project.outcome },
  ]

  return (
    <section id="case-study" className={`section bg-halo ${styles.section}`} data-moment="pinned-chapters" aria-labelledby="case-study-h">
      <div className="wrap mo-pc__grid">
        <div className="mo-pc__text">
          <h2 id="case-study-h" className="prompt-heading">
            <span className="prompt" aria-hidden="true">&gt; </span>case study: {project.title}
          </h2>
          <ol className="mo-pc__steps">
            {steps.map((step, i) => {
              const image = project.walkthroughImages?.[i] ?? project.image
              return (
                <li className="mo-pc__step" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <figure className="mo-pc__visual">
                    {image ? (
                      <img src={image.src} alt={image.alt} width={1200} height={750} loading="lazy" />
                    ) : (
                      <div className={styles.placeholder} aria-hidden="true">
                        {step.title}
                      </div>
                    )}
                  </figure>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="mo-pc__visuals frame" />
      </div>
    </section>
  )
}
