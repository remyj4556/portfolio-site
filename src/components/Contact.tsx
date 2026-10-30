import { site } from '../content/site.ts'
import { githubDisplay, githubUrl, linkedinDisplay } from '../content/derived.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons.tsx'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-heading">
          <span className="prompt" aria-hidden="true">&gt; </span>contact
        </h2>
        <p className={styles.invite}>I'm open to new roles. The best way to reach me is email.</p>
        <ul className={styles.links}>
          <li>
            <a href={`mailto:${site.email}`} className={styles.link}>
              <MailIcon size={20} />
              {site.email}
            </a>
          </li>
          <li>
            <ExternalLink href={site.linkedinUrl} className={styles.link}>
              <LinkedInIcon size={20} />
              {linkedinDisplay}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={githubUrl} className={styles.link}>
              <GitHubIcon size={20} />
              {githubDisplay}
            </ExternalLink>
          </li>
        </ul>
      </div>
    </section>
  )
}
