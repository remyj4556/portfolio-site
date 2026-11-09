import { site } from '../content/site.ts'
import { githubDisplay, githubUrl, linkedinDisplay } from '../content/derived.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons.tsx'
import styles from './Footer.module.css'

// Layout kit footer: the closing section (the "close-word" row) and the directory in one slab on
// the lit ground ("footer--statement"). It is also the Contact section (#contact).
export function Footer() {
  const statement = site.typedPhrases[site.typedPhrases.length - 1]

  return (
    <footer className="footer closing footer--statement" id="contact" aria-labelledby="close-h">
      <div className="wrap">
        <div className="closing__cta close--word">
          <div className="section-head--split">
            <div>
              <h2 id="close-h" className="prompt-heading">
                <span className="prompt" aria-hidden="true">&gt; </span>contact
              </h2>
              <p className="t-lead">I'm open to new roles. The best way to reach me is email.</p>
            </div>
            <a className="btn btn--primary" href={`mailto:${site.email}`}>
              Email me
            </a>
          </div>
          <p className={`close__word ${styles.word}`} aria-hidden="true">
            {site.name}
          </p>
        </div>

        <div className="closing__links">
          <div className="grid">
            <div className="span-4 stack-4">
              <a className="nav__logo" href="#top" aria-label={`${site.firstName}, back to top`}>
                <span className="mark" data-mark="ring" aria-hidden="true" />
                {site.firstName}
              </a>
              <p className="footer__lede">{statement}</p>
            </div>

            <div className={`span-5 start-6 footer__col ${styles.contactCol}`}>
              <h3>Contact</h3>
              <ul className={styles.contact}>
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

            <div className={`span-2 start-11 footer__col ${styles.sectionsCol}`}>
              <h3>Sections</h3>
              <ul>
                <li>
                  <a href="#projects">Projects</a>
                </li>
                <li>
                  <a href="#case-study">Case study</a>
                </li>
                <li>
                  <a href="#activity">Activity</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__legal">
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <ExternalLink href={site.sourceRepoUrl}>source</ExternalLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
