import { site } from './site.ts'

export const githubUrl = `https://github.com/${site.githubUsername}`
export const githubDisplay = `github.com/${site.githubUsername}`
export const linkedinDisplay = site.linkedinUrl
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/\/$/, '')
