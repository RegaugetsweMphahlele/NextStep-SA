import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { JobCard } from '../components/JobCard'
import { ErrorNotice } from '../components/Notice'
import { useJobs } from '../hooks/useJobs'
import { getJobMatches } from '../lib/matching'

export function JobsPage() {
  const { profile, profileError } = useAuth()
  const { jobs, savedIds, loading, error, toggleSaved } = useJobs()
  const [search, setSearch] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)

  const matches = useMemo(() => {
    if (!profile) return []
    return getJobMatches(profile, jobs).filter(({ job }) => {
      const query = search.trim().toLocaleLowerCase()
      const textMatch = !query || `${job.title} ${job.employer} ${job.location} ${job.sector} ${job.description}`.toLocaleLowerCase().includes(query)
      return textMatch && (!savedOnly || savedIds.includes(job.id))
    })
  }, [jobs, profile, savedIds, savedOnly, search])

  const searchTerms = encodeURIComponent(search.trim())
  const searchLocation = encodeURIComponent(profile?.province || 'South Africa')
  const partnerLinks = search.trim() ? [
    {
      name: 'LinkedIn Jobs',
      description: `Search LinkedIn for “${search.trim()}” roles in ${profile?.province || 'South Africa'}.`,
      href: `https://www.linkedin.com/jobs/search/?keywords=${searchTerms}&location=${searchLocation}`,
    },
    {
      name: 'Indeed South Africa',
      description: `See Indeed listings for “${search.trim()}” in ${profile?.province || 'South Africa'}.`,
      href: `https://za.indeed.com/jobs?q=${searchTerms}&l=${searchLocation}`,
    },
    {
      name: 'SAYouth.mobi',
      description: 'Browse youth-focused South African work and learning opportunities.',
      href: 'https://sayouth.mobi/',
    },
  ] : []

  return <main className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-forest">Opportunities</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Jobs for your next step.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Search your saved profile matches, then continue on LinkedIn, Indeed, SAYouth or the official government vacancy circular.</p>
      </div>
      <Link to="/profile" className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:border-forest/40">Update my profile</Link>
    </div>

    {profileError && <div className="mt-6"><ErrorNotice>{profileError}</ErrorNotice></div>}
    {error && <div className="mt-6"><ErrorNotice>{error}</ErrorNotice></div>}
    {!profile ? <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <h2 className="text-lg font-bold">Finish your profile to get relevant matches.</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">Add your qualifications, skills and career interests first. We’ll use those details to rank roles saved in your browser.</p>
      <Link to="/profile" className="mt-5 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">Complete my profile</Link>
    </div> : <>
      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-canvas px-3 py-2.5">
          <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <span className="sr-only">Search matched jobs</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search job title, skill or location" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </label>
        <button onClick={() => setSavedOnly((value) => !value)} aria-pressed={savedOnly} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${savedOnly ? 'bg-forest text-white' : 'border border-slate-200 text-slate-600 hover:text-forest'}`}>{savedOnly ? 'Showing saved' : 'Saved jobs'} {savedIds.length > 0 && `(${savedIds.length})`}</button>
      </div>

      {partnerLinks.length > 0 && <section className="mt-5 rounded-2xl border border-slate-200 bg-[#eaf0eb] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Continue your search for “{search.trim()}”</p>
        <p className="mt-2 text-sm text-muted">These links open live results on the job platforms. External vacancies are not shown as NextStep listings.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">{partnerLinks.map((link) => <a key={link.name} href={link.href} target="_blank" rel="noreferrer" className="rounded-xl border border-white bg-white p-4 transition hover:border-forest/30">
          <span className="text-sm font-bold text-ink">{link.name} <span aria-hidden="true">↗</span></span>
          <span className="mt-1 block text-xs leading-5 text-muted">{link.description}</span>
        </a>)}</div>
      </section>}

      {profile.preferred_sectors.length > 0 || profile.province ? <div className="mt-5 flex flex-wrap gap-2">
        {profile.preferred_sectors.map((sector) => <span key={sector} className="rounded-full bg-[#eaf0eb] px-3 py-1.5 text-xs font-medium text-forest">{sector}</span>)}
        {profile.province && <span className="rounded-full bg-[#eaf0eb] px-3 py-1.5 text-xs font-medium text-forest">{profile.province}</span>}
      </div> : null}

      {loading ? <p className="py-16 text-center text-sm text-muted">Loading your saved matches…</p> : matches.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{matches.map(({ job, match }) => <JobCard key={job.id} job={job} match={match} saved={savedIds.includes(job.id)} onToggleSaved={toggleSaved} />)}</div> :
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="font-semibold">{savedOnly ? 'No saved jobs match these filters.' : 'No saved vacancies match your profile yet.'}</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{savedOnly ? 'Turn off the saved-jobs filter or update your profile preferences.' : 'Search for a role above to see targeted links for LinkedIn, Indeed and SAYouth. We do not display sample listings as real openings.'}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/profile" className="rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white">Review my profile</Link>
            <a href="https://www.dpsa.gov.za/newsroom/psvc/" target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold">Government vacancies · DPSA ↗</a>
          </div>
        </div>}
    </>}
  </main>
}
