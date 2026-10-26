import type { JobPosting, Profile } from '../types'

const storageKey = 'nextstep-sa.local-data.v1'

type LocalAccount = {
  id: string
  email: string
  passwordSalt: string
  passwordHash: string
  profile: Profile
}

type LocalData = {
  accounts: LocalAccount[]
  currentUserId: string | null
  jobs: JobPosting[]
  savedJobs: Record<string, string[]>
}

export type LocalUser = { id: string; email: string }

export type ProfileValues = Omit<Profile, 'id' | 'updated_at'>

const emptyData = (): LocalData => ({ accounts: [], currentUserId: null, jobs: [], savedJobs: {} })

function readData(): LocalData {
  const stored = window.localStorage.getItem(storageKey)
  if (!stored) return emptyData()

  let data: unknown
  try {
    data = JSON.parse(stored)
  } catch {
    throw new Error('Your locally saved app data could not be read. Clear this site’s storage to start over.')
  }

  if (
    !data ||
    typeof data !== 'object' ||
    !Array.isArray((data as LocalData).accounts) ||
    !Array.isArray((data as LocalData).jobs) ||
    !(data as LocalData).savedJobs ||
    typeof (data as LocalData).savedJobs !== 'object' ||
    Array.isArray((data as LocalData).savedJobs)
  ) {
    throw new Error('Your locally saved app data has an unexpected format. Clear this site’s storage to start over.')
  }
  return data as LocalData
}

function writeData(data: LocalData) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(data))
    window.dispatchEvent(new Event('nextstep-data-changed'))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('This browser is out of storage space. Remove unused site data or free up space, then try again.')
    }
    throw new Error(error instanceof Error ? `Could not save app data in this browser: ${error.message}` : 'Could not save app data in this browser.')
  }
}

function toBase64(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return window.btoa(binary)
}

function fromBase64(value: string) {
  return Uint8Array.from(window.atob(value), (character) => character.charCodeAt(0))
}

async function hashPassword(password: string, salt: Uint8Array) {
  if (!window.crypto?.subtle) throw new Error('Password protection is unavailable in this browser context. Open the app on localhost or over HTTPS.')
  const key = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 150_000, hash: 'SHA-256' },
    key,
    256,
  )
  return toBase64(new Uint8Array(bits))
}

function publicUser(account: LocalAccount): LocalUser {
  return { id: account.id, email: account.email }
}

export function getCurrentUser(): LocalUser | null {
  const data = readData()
  const account = data.accounts.find((item) => item.id === data.currentUserId)
  return account ? publicUser(account) : null
}

export function getCurrentProfile(): Profile | null {
  const data = readData()
  return data.accounts.find((item) => item.id === data.currentUserId)?.profile ?? null
}

export async function registerAccount(email: string, password: string, values: ProfileValues) {
  const data = readData()
  const normalizedEmail = email.trim().toLocaleLowerCase()
  if (data.accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with that email already exists in this browser. Log in instead.')
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const account: LocalAccount = {
    id: window.crypto.randomUUID(),
    email: normalizedEmail,
    passwordSalt: toBase64(salt),
    passwordHash: await hashPassword(password, salt),
    profile: { ...values, id: '', updated_at: new Date().toISOString() },
  }
  account.profile.id = account.id
  data.accounts.push(account)
  data.currentUserId = account.id
  writeData(data)
  return { user: publicUser(account), profile: account.profile }
}

export async function signInAccount(email: string, password: string) {
  const data = readData()
  const normalizedEmail = email.trim().toLocaleLowerCase()
  const account = data.accounts.find((item) => item.email === normalizedEmail)
  if (!account) throw new Error('No account with that email exists in this browser. Check the address or create an account.')
  const passwordHash = await hashPassword(password, fromBase64(account.passwordSalt))
  if (passwordHash !== account.passwordHash) throw new Error('That password does not match this browser account.')
  data.currentUserId = account.id
  writeData(data)
  return { user: publicUser(account), profile: account.profile }
}

export function saveCurrentProfile(values: ProfileValues) {
  const data = readData()
  const account = data.accounts.find((item) => item.id === data.currentUserId)
  if (!account) throw new Error('Sign in before saving your profile.')
  account.profile = { ...values, id: account.id, updated_at: new Date().toISOString() }
  writeData(data)
  return account.profile
}

export function signOutAccount() {
  const data = readData()
  data.currentUserId = null
  writeData(data)
}

export function getCurrentJobs() {
  const today = new Date().toISOString().slice(0, 10)
  return readData().jobs.filter((job) => job.is_active && (!job.application_deadline || job.application_deadline >= today))
}

export function getCurrentSavedJobIds() {
  const data = readData()
  return data.currentUserId ? data.savedJobs[data.currentUserId] ?? [] : []
}

export function toggleSavedJob(jobId: string) {
  const data = readData()
  if (!data.currentUserId) throw new Error('Sign in to save jobs to your account.')
  if (!data.jobs.some((job) => job.id === jobId)) throw new Error('This vacancy is no longer available.')
  const current = data.savedJobs[data.currentUserId] ?? []
  data.savedJobs[data.currentUserId] = current.includes(jobId)
    ? current.filter((savedId) => savedId !== jobId)
    : [...current, jobId]
  writeData(data)
  return data.savedJobs[data.currentUserId]
}

export function addLocalJob(job: Omit<JobPosting, 'id' | 'posted_at' | 'is_active'>) {
  const data = readData()
  if (!data.currentUserId) throw new Error('Sign in before adding a vacancy.')
  const sourceUrl = new URL(job.source_url)
  if (sourceUrl.protocol !== 'https:') throw new Error('The original advert must use a secure HTTPS link.')
  if (data.jobs.some((item) => item.source_url === sourceUrl.href)) {
    throw new Error('A vacancy from this advert link is already saved in this browser.')
  }
  const newJob: JobPosting = {
    ...job,
    id: window.crypto.randomUUID(),
    source_url: sourceUrl.href,
    posted_at: new Date().toISOString(),
    is_active: true,
    submitted_by: data.currentUserId,
  }
  data.jobs.push(newJob)
  writeData(data)
  return newJob
}

export function removeLocalJob(jobId: string) {
  const data = readData()
  const job = data.jobs.find((item) => item.id === jobId)
  if (!data.currentUserId || job?.submitted_by !== data.currentUserId) {
    throw new Error('Only the account that added a vacancy can remove it from this browser.')
  }
  data.jobs = data.jobs.filter((item) => item.id !== jobId)
  for (const [userId, savedIds] of Object.entries(data.savedJobs)) {
    data.savedJobs[userId] = savedIds.filter((id) => id !== jobId)
  }
  writeData(data)
}
