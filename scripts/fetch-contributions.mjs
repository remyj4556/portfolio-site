// @ts-check
// Fetches the GitHub contribution calendar at build time and writes
// src/data/contributions.json (see DESIGN.md §5.3).
//
// - No GH_CONTRIB_TOKEN: writes { status: "unavailable" } and exits 0.
// - Token set and anything goes wrong: writes nothing and exits non-zero,
//   failing the build so a broken token is noticed.

import { writeFile } from 'node:fs/promises'
import { site } from '../src/content/site.ts'

const OUTPUT = new URL('../src/data/contributions.json', import.meta.url)

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            weekday
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`

/** @type {Record<string, 0 | 1 | 2 | 3 | 4>} */
const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

class FetchError extends Error {}

/**
 * @param {unknown} condition
 * @param {string} message
 * @returns {asserts condition}
 */
function check(condition, message) {
  if (!condition) throw new FetchError(message)
}

/** @param {unknown} value */
function isNonNegativeInteger(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

/**
 * @param {any} calendar
 * @returns {{ total: number, weeks: { days: { date: string, weekday: number, count: number, level: 0 | 1 | 2 | 3 | 4 }[] }[] }}
 */
function parseCalendar(calendar) {
  check(calendar && typeof calendar === 'object', 'contributionCalendar is missing')
  check(isNonNegativeInteger(calendar.totalContributions), 'totalContributions is not a non-negative integer')
  check(Array.isArray(calendar.weeks), 'weeks is not an array')

  const weeks = calendar.weeks.map((/** @type {any} */ week, /** @type {number} */ w) => {
    check(week && Array.isArray(week.contributionDays), `weeks[${w}].contributionDays is not an array`)
    return {
      days: week.contributionDays.map((/** @type {any} */ day, /** @type {number} */ d) => {
        const where = `weeks[${w}].contributionDays[${d}]`
        check(day && typeof day === 'object', `${where} is not an object`)
        check(typeof day.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day.date), `${where}.date is not YYYY-MM-DD`)
        check(Number.isInteger(day.weekday) && day.weekday >= 0 && day.weekday <= 6, `${where}.weekday is not 0–6`)
        check(isNonNegativeInteger(day.contributionCount), `${where}.contributionCount is not a non-negative integer`)
        check(Object.hasOwn(LEVELS, day.contributionLevel), `${where}.contributionLevel is unknown: ${day.contributionLevel}`)
        return {
          date: day.date,
          weekday: day.weekday,
          count: day.contributionCount,
          level: LEVELS[day.contributionLevel],
        }
      }),
    }
  })

  return { total: calendar.totalContributions, weeks }
}

async function main() {
  const token = process.env.GH_CONTRIB_TOKEN

  if (!token) {
    console.warn('[fetch-contributions] GH_CONTRIB_TOKEN is not set; the activity section will show its fallback.')
    await writeFile(OUTPUT, JSON.stringify({ status: 'unavailable', reason: 'no-token' }, null, 2) + '\n')
    return
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-site-build',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: site.githubUsername } }),
  })

  check(response.ok, `GitHub responded with HTTP ${response.status} ${response.statusText}`)

  const body = await response.json()
  check(
    !(Array.isArray(body?.errors) && body.errors.length > 0),
    `GitHub returned GraphQL errors: ${JSON.stringify(body?.errors)}`,
  )
  check(body?.data?.user, `GitHub user "${site.githubUsername}" was not found`)

  const { total, weeks } = parseCalendar(body.data.user.contributionsCollection?.contributionCalendar)
  const data = { status: 'ok', fetchedAt: new Date().toISOString(), total, weeks }

  await writeFile(OUTPUT, JSON.stringify(data) + '\n')
  console.log(`[fetch-contributions] Wrote ${total} contributions across ${weeks.length} weeks.`)
}

main().catch((error) => {
  console.error(`[fetch-contributions] Failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
