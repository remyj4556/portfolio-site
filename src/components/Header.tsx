import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { site } from '../content/site.ts'
import { ExternalLink } from './ExternalLink.tsx'
import styles from './Header.module.css'

const NAV_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#activity', label: 'Activity' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close on a click outside the header.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function onKeyDown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  // Close when focus leaves the header (e.g. tabbing past the last link).
  function onBlur(event: FocusEvent) {
    if (open && !headerRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
  }

  return (
    <header ref={headerRef} className={styles.header} onKeyDown={onKeyDown} onBlur={onBlur}>
      <div className={styles.bar}>
        <a href="#top" className={styles.logo} aria-label={`${site.firstName}, back to top`}>
          <span className={styles.bracket} aria-hidden="true">&lt;</span>
          <span className={styles.logoName}>{site.firstName}</span>
          <span className={styles.bracket} aria-hidden="true"> /&gt;</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'close' : 'menu'}
          </button>

          <ul id="site-menu" className={`${styles.links} ${open ? styles.open : ''}`} onClick={() => setOpen(false)}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={styles.navLink}>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <ExternalLink href={site.resumePath} className={styles.resume}>
                Résumé
              </ExternalLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
