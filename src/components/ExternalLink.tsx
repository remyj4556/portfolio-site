import type { AnchorHTMLAttributes } from 'react'
import { VisuallyHidden } from './VisuallyHidden.tsx'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & { href: string }

// Links that leave the site (and the résumé) open in a new tab and say so (DESIGN.md §4.7).
export function ExternalLink({ children, ...props }: Props) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
    </a>
  )
}
