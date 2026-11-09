import { projects } from '../content/projects.ts'
import { ProjectCard } from './ProjectCard.tsx'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <section id="projects" className={`section ${styles.section}`} aria-labelledby="projects-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="projects-h" className="prompt-heading">
            <span className="prompt" aria-hidden="true">&gt; </span>projects
          </h2>
        </div>
        <ul className={styles.grid}>
          {projects.map((project, i) => (
            <li key={project.id}>
              <ProjectCard project={project} index={i + 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
