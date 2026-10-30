import { site } from '../content/site.ts'
import { ExternalLink } from './ExternalLink.tsx'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <p>
        © {new Date().getFullYear()} {site.name} · <ExternalLink href={site.sourceRepoUrl}>source</ExternalLink>
      </p>
    </footer>
  )
}
