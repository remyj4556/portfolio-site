// @ts-check
// Vercel Cron target: triggers a redeploy once a day so the build-time
// contribution data stays fresh (see DESIGN.md §5.3).

import { timingSafeEqual } from 'node:crypto'

/**
 * @param {string} received
 * @param {string} expected
 */
function safeEqual(received, expected) {
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** @param {Request} request */
export async function GET(request) {
  const secret = process.env.CRON_SECRET
  const authorization = request.headers.get('authorization') ?? ''

  if (!secret || !safeEqual(authorization, `Bearer ${secret}`)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const hook = process.env.VERCEL_DEPLOY_HOOK
  if (!hook) {
    return new Response('Deploy hook is not configured', { status: 502 })
  }

  try {
    const response = await fetch(hook, { method: 'POST' })
    if (!response.ok) {
      return new Response(`Deploy hook responded with ${response.status}`, { status: 502 })
    }
  } catch {
    return new Response('Deploy hook request failed', { status: 502 })
  }

  return new Response('Rebuild triggered', { status: 200 })
}
