import { site } from '../content/site.ts'
import { ExternalLink } from './ExternalLink.tsx'

const NAV_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#activity', label: 'Activity' },
  { href: '#contact', label: 'Contact' },
]

// Layout kit "nav-centre" bar. The kit's script owns the mobile sheet: it flips aria-expanded
// on the toggle and opens or closes the sheet, so no menu state lives here.
export function Header() {
  return (
    <header className="nav nav--centre">
      <div className="wrap nav__bar">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <a className="nav__logo" href="#top" aria-label={`${site.firstName}, back to top`}>
          <span className="mark" data-mark="ring" aria-hidden="true" />
          {site.firstName}
        </a>

        <nav className="nav__links" aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => (
            <div className="nav__item" key={href}>
              <a className="nav__link" href={href}>
                {label}
              </a>
            </div>
          ))}
        </nav>

        <div className="nav__actions">
          <ExternalLink href={site.resumePath} className="btn btn--primary">
            Résumé
          </ExternalLink>
        </div>

        <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  )
}
