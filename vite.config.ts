import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { site } from './src/content/site.ts'
import { githubUrl } from './src/content/derived.ts'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

// Fills the metadata placeholders in index.html from src/content/site.ts.
// Edits to site.ts need a dev-server restart to show up here.
function siteMetadata(): Plugin {
  const noscript = `<noscript>
      <div style="max-width:70ch;margin:0 auto;padding:24px 16px">
        <h1>${escapeHtml(site.name)}</h1>
        <p>${escapeHtml(site.role)}</p>
        <ul>
          <li><a href="${escapeHtml(site.resumePath)}">Résumé</a></li>
          <li><a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></li>
          <li><a href="${escapeHtml(site.linkedinUrl)}">LinkedIn</a></li>
          <li><a href="${escapeHtml(githubUrl)}">GitHub</a></li>
        </ul>
      </div>
    </noscript>`

  const replacements: Record<string, string> = {
    '%SITE_TITLE%': escapeHtml(`${site.name} — ${site.role}`),
    '%SITE_DESCRIPTION%': escapeHtml(site.description),
    '%SITE_URL%': escapeHtml(site.siteUrl),
    '%OG_IMAGE_URL%': escapeHtml(`${site.siteUrl}/og-image.png`),
    '%NOSCRIPT%': noscript,
  }

  return {
    name: 'site-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return Object.entries(replacements).reduce(
          (result, [placeholder, value]) => result.replaceAll(placeholder, value),
          html,
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [siteMetadata(), react()],
})
