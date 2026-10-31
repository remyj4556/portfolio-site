// @ts-check
// Fetches the résumé PDF at build time and writes it to public/ at
// site.resumePath (see DESIGN.md §5.2).
//
// - Success: overwrites the committed copy with the fetched PDF.
// - Anything goes wrong: keeps the committed copy, warns, and exits 0.
//   A stale résumé is better than a failed deploy.

import { writeFile } from 'node:fs/promises'
import { site } from '../src/content/site.ts'

const OUTPUT = new URL(`../public${site.resumePath}`, import.meta.url)
const TIMEOUT_MS = 15_000

async function main() {
  const response = await fetch(site.resumeSourceUrl, {
    headers: { 'User-Agent': 'portfolio-site-build' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`)

  const pdf = Buffer.from(await response.arrayBuffer())
  // Guard against serving an error page as the résumé.
  if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') throw new Error('response is not a PDF')

  await writeFile(OUTPUT, pdf)
  console.log(`[fetch-resume] Wrote ${pdf.length} bytes to public${site.resumePath}.`)
}

main().catch((error) => {
  console.warn(
    `[fetch-resume] Failed: ${error instanceof Error ? error.message : String(error)}; keeping the committed copy.`,
  )
})
