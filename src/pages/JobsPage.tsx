import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { JobCard } from '../components/JobCard'
import { ErrorNotice } from '../components/Notice'
import { getJobMatches } from '../lib/matching'
import { useJobs } from '../hooks/useJobs'
import { addLocalJob, removeLocalJob } from '../lib/localStore'
import { provinces, sectors, workTypes } from '../types'
import type { JobPosting } from '../types'

function parseList(value: string) {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]
}

const emptyVacancy = {
  title: '',
  employer: '',
  location: '',
  province: '',
  sector: '',
  employment_type: '',
  description: '',
  required_skills: '',
  qualification_keywords: '',
  application_deadline: '',
  source_url: '',
  checked: false,
}

export function JobsPage() {
  const { profile, profileError, user } = useAuth()
  const { jobs, savedIds, loading, error: jobsError, toggleSaved, reload } = useJobs()
  const [search, setSearch] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [vacancy, setVacancy] = useState(emptyVacancy)
  const [formError, setFormError] = useState('')
  const [formNotice, setFormNotice] = useState('')
  const [removalError, setRemovalError] = useState('')
  const [submittedJob, setSubmittedJob] = useState<JobPosting | null>(null)
  const [busy, setBusy] = useState(false)

  const matches = useMemo(() => {
    if (!profile) return []
    return getJobMatches(profile, jobs).filter(({ job }) => {
      const query = search.trim().toLocaleLowerCase()
      const textMatch = !query || `${job.title} ${job.employer} ${job.location} ${job.sector} ${job.description}`.toLocaleLowerCase().includes(query)
      return textMatch && (!savedOnly || savedIds.includes(job.id))
    })
  }, [jobs, profile, savedIds, savedOnly, search])

  function handleAddVacancy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setFormNotice('')
    setBusy(true)
    try {
      if (!vacancy.checked) throw new Error('Confirm that you checked the vacancy and its closing date on the original advert.')
      const link = new URL(vacancy.source_url)
      if (link.protocol !== 'https:') throw new Error('The original advert link must use HTTPS.')
      const job = addLocalJob({
        title: vacancy.title.trim(),
        employer: vacancy.employer.trim(),
        location: vacancy.location.trim(),
        province: vacancy.province || null,
        sector: vacancy.sector,
        employment_type: vacancy.employment_type,
        description: vacancy.description.trim(),
        required_skills: parseList(vacancy.required_skills),
        qualification_keywords: parseList(vacancy.qualification_keywords),
        application_deadline: vacancy.application_deadline || null,
        source_url: link.href,
        submitted_by: user?.id,
      })
      setSubmittedJob(job)
      setFormNotice('Vacancy saved in this browser. Review the original advert before applying.')
      setVacancy(emptyVacancy)
      setShowAddForm(false)
      reload()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not save this vacancy. Please check the details and try again.')
    } finally {
      setBusy(false)
    }
  }

  function handleRemoveJob(jobId: string) {
    setRemovalError('')
    try {
      removeLocalJob(jobId)
      if (submittedJob?.id === jobId) setSubmittedJob(null)
      reload()
    } catch (error) {
      setRemovalError(error instanceof Error ? error.message : 'Could not remove this vacancy.')
    }
  }

  return <main className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-forest">Opportunities in this browser</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Jobs for your next step.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Add vacancies from original adverts and we’ll rank them against your profile. Job links and details you add are only stored in this browser.</p></div>
      <div className="flex flex-wrap gap-2"><Link to="/profile" className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:border-forest/40">Update my profile</Link><button onClick={() => { setShowAddForm((show) => !show); setFormError('') }} className="inline-flex w-fit items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163f36]">{showAddForm ? 'Close form' : 'Add a vacancy'} <span aria-hidden="true">{showAddForm ? '×' : '+'}</span></button></div>
    </div>

    {profileError && <div className="mt-6"><ErrorNotice>{profileError}</ErrorNotice></div>}
    {jobsError && <div className="mt-6"><ErrorNotice>{jobsError}</ErrorNotice></div>}
    {removalError && <div className="mt-6"><ErrorNotice>{removalError}</ErrorNotice></div>}
    {formNotice && <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">{formNotice}{submittedJob && <> <a className="font-semibold underline" href={submittedJob.source_url} target="_blank" rel="noreferrer">Open source advert ↗</a></>}</p>}
    {showAddForm && <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Add an actual advertised role</p><h2 className="mt-2 text-xl font-bold">Save a vacancy from its original source.</h2><p className="mt-2 text-sm leading-6 text-muted">Enter details from a live employer or government advert and include its secure HTTPS URL. Listings are not reviewed or shared with other devices in this local version.</p></div>
      {formError && <div className="mb-5"><ErrorNotice>{formError}</ErrorNotice></div>}
      <form onSubmit={handleAddVacancy} className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Job title *</span><input required value={vacancy.title} onChange={(event) => setVacancy({ ...vacancy, title: event.target.value })} className="form-input" placeholder="Title exactly as advertised" /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Employer / department *</span><input required value={vacancy.employer} onChange={(event) => setVacancy({ ...vacancy, employer: event.target.value })} className="form-input" placeholder="Name in the advert" /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Location *</span><input required value={vacancy.location} onChange={(event) => setVacancy({ ...vacancy, location: event.target.value })} className="form-input" placeholder="City, remote or area" /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Province</span><select value={vacancy.province} onChange={(event) => setVacancy({ ...vacancy, province: event.target.value })} className="form-input"><option value="">Not specified</option>{provinces.map((province) => <option key={province}>{province}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Sector *</span><select required value={vacancy.sector} onChange={(event) => setVacancy({ ...vacancy, sector: event.target.value })} className="form-input"><option value="">Choose a sector</option>{sectors.map((sector) => <option key={sector}>{sector}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Work type *</span><select required value={vacancy.employment_type} onChange={(event) => setVacancy({ ...vacancy, employment_type: event.target.value })} className="form-input"><option value="">Choose a work type</option>{workTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Required skills</span><input value={vacancy.required_skills} onChange={(event) => setVacancy({ ...vacancy, required_skills: event.target.value })} className="form-input" placeholder="Excel, project management" /><span className="mt-1 block text-xs text-muted">Separate with commas.</span></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Qualification keywords</span><input value={vacancy.qualification_keywords} onChange={(event) => setVacancy({ ...vacancy, qualification_keywords: event.target.value })} className="form-input" placeholder="Diploma, accounting" /><span className="mt-1 block text-xs text-muted">Separate with commas.</span></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Application closing date</span><input type="date" min={new Date().toISOString().slice(0, 10)} value={vacancy.application_deadline} onChange={(event) => setVacancy({ ...vacancy, application_deadline: event.target.value })} className="form-input" /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Original advert URL *</span><input required type="url" pattern="https://.+" value={vacancy.source_url} onChange={(event) => setVacancy({ ...vacancy, source_url: event.target.value })} className="form-input" placeholder="https://employer.example/jobs/123" /></label>
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Advert summary *</span><textarea required maxLength={2500} rows={4} value={vacancy.description} onChange={(event) => setVacancy({ ...vacancy, description: event.target.value })} className="form-input resize-y" placeholder="Summarise the actual role and its stated requirements." /></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600 sm:col-span-2"><input required type="checkbox" checked={vacancy.checked} onChange={(event) => setVacancy({ ...vacancy, checked: event.target.checked })} className="mt-1 accent-[#1e5146]" /><span>I checked this vacancy and closing date against the original advert. I understand it is saved only in this browser and other users cannot see or verify it.</span></label>
        <button disabled={busy} className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2">{busy ? 'Saving vacancy…' : 'Save vacancy in this browser'}</button>
      </form>
    </section>}
    {!profile ? <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <h2 className="text-lg font-bold">Finish your profile to get relevant matches.</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">Add your qualifications, skills and career interests first. We’ll use those details to rank published vacancies rather than showing the same generic jobs to everyone.</p><Link to="/profile" className="mt-5 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">Complete my profile</Link>
    </div> : <>
      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-canvas px-3 py-2.5">
          <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <span className="sr-only">Search matched jobs</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, employer or location" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </label>
        <button onClick={() => setSavedOnly((value) => !value)} aria-pressed={savedOnly} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${savedOnly ? 'bg-forest text-white' : 'border border-slate-200 text-slate-600 hover:text-forest'}`}>{savedOnly ? 'Showing saved' : 'Saved jobs'} {savedIds.length > 0 && `(${savedIds.length})`}</button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">{profile.preferred_sectors.map((sector) => <span key={sector} className="rounded-full bg-[#eaf0eb] px-3 py-1.5 text-xs font-medium text-forest">{sector}</span>)}{profile.province && <span className="rounded-full bg-[#eaf0eb] px-3 py-1.5 text-xs font-medium text-forest">{profile.province}</span>}</div>

      {loading ? <p className="py-16 text-center text-sm text-muted">Loading vacancies from this browser…</p> : matches.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{matches.map(({ job, match }) => <JobCard key={job.id} job={job} match={match} saved={savedIds.includes(job.id)} onToggleSaved={toggleSaved} canRemove={job.submitted_by === user?.id} onRemove={handleRemoveJob} />)}</div> :
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="font-semibold">{savedOnly ? 'No saved jobs match these filters.' : jobs.length ? 'No saved vacancies match your profile yet.' : 'No vacancies have been added in this browser yet.'}</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{savedOnly ? 'Turn off the saved-jobs filter or update your profile preferences.' : jobs.length ? 'Try broadening your skills or interests. You can also add an actual vacancy from its original advert.' : 'Add a vacancy by copying details from an actual open advert. We don’t fill this page with invented jobs. Local vacancies stay on this device.'}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/profile" className="rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white">Review my profile</Link>
            <button onClick={() => setShowAddForm(true)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold">Add a vacancy</button>
            <a href="https://www.dpsa.gov.za/newsroom/psvc/" target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold">DPSA vacancy circulars ↗</a>
          </div>
        </div>}
    </>}
  </main>
}
