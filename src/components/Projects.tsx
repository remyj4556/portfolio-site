import { projects } from '../content/projects.ts'
import { ProjectCard } from './ProjectCard.tsx'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-heading">
          <span className="prompt" aria-hidden="true">&gt; </span>projects
        </h2>
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
