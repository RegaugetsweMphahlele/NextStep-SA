import type { JobPosting, Profile } from '../types'

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function containsPhrase(text: string, phrase: string) {
  return ` ${text} `.includes(` ${phrase} `)
}

function overlaps(preferences: string[], requirements: string[]) {
  const normalizedRequirements = requirements.map(normalize).filter(Boolean)
  if (!preferences.length || !normalizedRequirements.length) return 0
  return preferences.filter((preference) => {
    const normalized = normalize(preference)
    return normalizedRequirements.some((requirement) =>
      containsPhrase(requirement, normalized) || containsPhrase(normalized, requirement),
    )
  }).length
}

const minimumMatchScore = 15

export function scoreJob(profile: Profile, job: JobPosting) {
  let score = 0
  const skillsMatch = overlaps(profile.skills, job.required_skills)
  if (profile.skills.length) score += Math.round((skillsMatch / profile.skills.length) * 45)

  const qualificationMatch = overlaps(
    [profile.qualification, profile.education_level].filter(Boolean),
    job.qualification_keywords,
  )
  if (profile.qualification || profile.education_level) score += Math.min(25, qualificationMatch * 13)

  if (overlaps(profile.interests, [job.title, job.description, job.sector])) score += 15
  if (profile.preferred_sectors.some((sector) => normalize(sector) === normalize(job.sector))) score += 10
  if (job.province && normalize(job.province) === normalize(profile.province)) score += 5
  if (profile.work_types.some((type) => normalize(type) === normalize(job.employment_type))) score += 5

  return Math.min(score, 100)
}

export function getJobMatches(profile: Profile, jobs: JobPosting[]) {
  const profileHasPreferences = Boolean(
    profile.skills.length ||
      profile.interests.length ||
      profile.preferred_sectors.length ||
      profile.qualification ||
      profile.education_level,
  )

  if (!profileHasPreferences) return []

  return jobs
    .map((job) => ({ job, match: scoreJob(profile, job) }))
    .filter(({ match }) => match >= minimumMatchScore)
    .sort((a, b) => b.match - a.match || a.job.title.localeCompare(b.job.title))
}
