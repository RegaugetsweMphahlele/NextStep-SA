import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ErrorNotice } from '../components/Notice'
import { careerStages, educationLevels, provinces, sectors, workTypes } from '../types'
import type { Profile } from '../types'

type ProfileValues = Omit<Profile, 'id' | 'updated_at'>

const emptyProfile: ProfileValues = {
  full_name: '',
  phone: '',
  province: '',
  career_stage: '',
  education_level: '',
  qualification: '',
  professional_summary: '',
  work_experience: '',
  skills: [],
  interests: [],
  preferred_sectors: [],
  work_types: [],
}

function parseTags(value: string) {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]
}

function TagInput({ label, value, onChange, placeholder, required = false }: {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  required?: boolean
}) {
  return <label className="block">
    <span className="mb-1.5 block text-sm font-semibold">{label}{required && <span className="text-coral"> *</span>}</span>
    <input required={required} value={value.join(', ')} onChange={(event) => onChange(parseTags(event.target.value))} placeholder={placeholder} className="form-input" />
    <span className="mt-1 block text-xs text-muted">Separate each item with a comma.</span>
  </label>
}

function ProfileFields({ values, setValues, includeSummary = false }: {
  values: ProfileValues
  setValues: (values: ProfileValues) => void
  includeSummary?: boolean
}) {
  const update = <K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) => setValues({ ...values, [key]: value })
  const toggleChoice = (key: 'preferred_sectors' | 'work_types', value: string) => {
    const current = values[key]
    update(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }
  const selectClass = 'form-input'

  return <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">Full name <span className="text-coral">*</span></span>
      <input required autoComplete="name" value={values.full_name} onChange={(event) => update('full_name', event.target.value)} className={selectClass} placeholder="Your name" />
    </label>
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">Phone number</span>
      <input autoComplete="tel" type="tel" value={values.phone} onChange={(event) => update('phone', event.target.value)} className={selectClass} placeholder="+27 82 000 0000" />
    </label>
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">Province <span className="text-coral">*</span></span>
      <select required value={values.province} onChange={(event) => update('province', event.target.value)} className={selectClass}>
        <option value="">Choose your province</option>{provinces.map((province) => <option key={province}>{province}</option>)}
      </select>
    </label>
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">Career stage <span className="text-coral">*</span></span>
      <select required value={values.career_stage} onChange={(event) => update('career_stage', event.target.value)} className={selectClass}>
        <option value="">Choose a career stage</option>{careerStages.map((stage) => <option key={stage}>{stage}</option>)}
      </select>
    </label>
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">Highest education <span className="text-coral">*</span></span>
      <select required value={values.education_level} onChange={(event) => update('education_level', event.target.value)} className={selectClass}>
        <option value="">Choose your highest level</option>{educationLevels.map((level) => <option key={level}>{level}</option>)}
      </select>
    </label>
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">Qualification / field of study <span className="text-coral">*</span></span>
      <input required value={values.qualification} onChange={(event) => update('qualification', event.target.value)} className={selectClass} placeholder="e.g. Diploma in Financial Accounting" />
    </label>
    <TagInput label="Skills" value={values.skills} onChange={(value) => update('skills', value)} placeholder="e.g. Excel, customer service, Python" required />
    <TagInput label="Career interests" value={values.interests} onChange={(value) => update('interests', value)} placeholder="e.g. data analysis, community development" />
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 text-sm font-semibold">Sectors you’re interested in</legend>
      <div className="flex flex-wrap gap-2">{sectors.map((sector) => <button type="button" key={sector} aria-pressed={values.preferred_sectors.includes(sector)} onClick={() => toggleChoice('preferred_sectors', sector)} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${values.preferred_sectors.includes(sector) ? 'border-forest bg-forest text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-forest/40'}`}>{sector}</button>)}</div>
    </fieldset>
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 text-sm font-semibold">Work types you’d consider</legend>
      <div className="flex flex-wrap gap-2">{workTypes.map((workType) => <button type="button" key={workType} aria-pressed={values.work_types.includes(workType)} onClick={() => toggleChoice('work_types', workType)} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${values.work_types.includes(workType) ? 'border-forest bg-forest text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-forest/40'}`}>{workType}</button>)}</div>
    </fieldset>
    {includeSummary && <label className="block sm:col-span-2">
      <span className="mb-1.5 block text-sm font-semibold">Professional summary <span className="font-normal text-muted">(optional)</span></span>
      <textarea maxLength={1200} rows={4} value={values.professional_summary ?? ''} onChange={(event) => update('professional_summary', event.target.value)} placeholder="A few sentences about the experience, strengths and contribution you bring." className="form-input resize-y" />
      <span className="mt-1 block text-xs text-muted">This can be used in your printable CV. Avoid including private identification numbers.</span>
    </label>}
    {includeSummary && <label className="block sm:col-span-2">
      <span className="mb-1.5 block text-sm font-semibold">Work, volunteer or project experience <span className="font-normal text-muted">(optional)</span></span>
      <textarea maxLength={5000} rows={5} value={values.work_experience ?? ''} onChange={(event) => update('work_experience', event.target.value)} placeholder={'Role or project · organisation · dates\nWhat you did and the results you achieved'} className="form-input resize-y" />
      <span className="mt-1 block text-xs text-muted">Include role names, organisations, dates and achievements. This will appear in your CV draft.</span>
    </label>}
  </div>
}

function AuthFrame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:px-12">
    <div className="pt-4 lg:sticky lg:top-8">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-forest">NextStep SA</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-md leading-7 text-muted">{description}</p>
      <div className="mt-7 rounded-2xl bg-[#eaf0eb] p-5">
        <p className="font-semibold">Saved on this device.</p>
        <p className="mt-2 text-sm leading-6 text-muted">This demo stores your account and profile in this browser. It is not production-grade account security, will not sync to other devices, and clearing site data removes it. Don’t reuse a password or enter sensitive personal information.</p>
      </div>
    </div>
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">{children}</section>
  </main>
}

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { user, register, signIn } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState<ProfileValues>(emptyProfile)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const isSignup = mode === 'signup'

  if (user) return <Navigate to="/app" replace />

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (isSignup && values.skills.length === 0) {
      setError('Add at least one skill so your profile can be matched to relevant roles.')
      return
    }
    if (isSignup && password !== passwordConfirmation) {
      setError('Your passwords do not match.')
      return
    }
    setBusy(true)
    try {
      if (isSignup) {
        await register(email, password, values)
        navigate('/app')
      } else {
        await signIn(email, password)
        navigate('/app')
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We could not complete that request. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <AuthFrame title={isSignup ? 'Create your profile.' : 'Welcome back.'} description={isSignup ? 'Tell us what you bring and where you want to go. You can update these details at any time.' : 'Sign in to see your saved profile, job matches and application resources.'}>
    {error && <div className="mb-5"><ErrorNotice>{error}</ErrorNotice></div>}
    {success && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">{success}</p>}
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
      {isSignup && <><div><h2 className="text-lg font-bold">About you</h2><p className="mt-1 text-sm text-muted">These details help us find relevant opportunities.</p></div><ProfileFields values={values} setValues={setValues} includeSummary /></>}
      <div className={isSignup ? 'border-t border-slate-100 pt-5' : ''}><h2 className="text-lg font-bold">{isSignup ? 'Sign-in details' : 'Sign in'}</h2></div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Email address</span>
        <input required autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="form-input" placeholder="you@example.com" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Password</span>
        <input required autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={isSignup ? 8 : undefined} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="form-input" placeholder={isSignup ? 'At least 8 characters' : 'Your password'} />
      </label>
      {isSignup && <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Confirm password</span>
        <input required autoComplete="new-password" minLength={8} type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} className="form-input" placeholder="Re-enter your password" />
      </label>}
      <button disabled={busy} className="w-full rounded-xl bg-forest px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#163f36] disabled:cursor-wait disabled:opacity-60">{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}</button>
    </form>
    <p className="mt-6 text-center text-sm text-muted">{isSignup ? 'Already have an account?' : 'New to NextStep SA?'} <Link className="font-semibold text-forest underline underline-offset-4" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create a profile'}</Link></p>
  </AuthFrame>
}

export function ProfilePage() {
  const { user, profile, profileError, refreshProfile, saveProfile } = useAuth()
  const [values, setValues] = useState<ProfileValues>(emptyProfile)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (profile) setValues({
      full_name: profile.full_name ?? '',
      phone: profile.phone ?? '',
      province: profile.province ?? '',
      career_stage: profile.career_stage ?? '',
      education_level: profile.education_level ?? '',
      qualification: profile.qualification ?? '',
      professional_summary: profile.professional_summary ?? '',
      work_experience: profile.work_experience ?? '',
      skills: profile.skills ?? [],
      interests: profile.interests ?? [],
      preferred_sectors: profile.preferred_sectors ?? [],
      work_types: profile.work_types ?? [],
    })
  }, [profile])

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (values.skills.length === 0) {
      setError('Add at least one skill so your profile can be matched to relevant roles.')
      return
    }
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      await saveProfile(values)
      setSuccess('Your profile is saved. Your job matches will now use these details.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save your profile.')
    } finally {
      setBusy(false)
    }
  }

  if (!user) return null

  return <AuthFrame title="Your profile." description="Keep these details current. Your saved profile is used to rank relevant opportunities and create a printable CV.">
    {profileError && <div className="mb-5"><ErrorNotice>{profileError} <button onClick={() => void refreshProfile()} className="ml-1 font-semibold underline">Try again</button></ErrorNotice></div>}
    {error && <div className="mb-5"><ErrorNotice>{error}</ErrorNotice></div>}
    {success && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{success}</p>}
    <form onSubmit={(event) => void handleSave(event)} className="space-y-6">
      <ProfileFields values={values} setValues={setValues} includeSummary />
      <button disabled={busy} className="w-full rounded-xl bg-forest px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#163f36] disabled:opacity-50">{busy ? 'Saving…' : 'Save profile'}</button>
    </form>
  </AuthFrame>
}
