import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { JobCard } from '../components/JobCard'
import { ErrorNotice } from '../components/Notice'
import { useJobs } from '../hooks/useJobs'
import { getJobMatches } from '../lib/matching'

export function Dashboard() {
  const { user, profile, profileError } = useAuth()
  const { jobs, savedIds, loading, error, toggleSaved } = useJobs()
  const matches = profile ? getJobMatches(profile, jobs).slice(0, 3) : []
  const firstName = profile?.full_name.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return <main className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-forest">Your workspace</p>
    <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Good to see you, {firstName}.</h1><p className="mt-2 text-sm text-muted">A clearer view of your career search starts here.</p></div><Link to="/profile" className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold">Edit my profile</Link></div>
    {profileError && <div className="mt-6"><ErrorNotice>{profileError}</ErrorNotice></div>}
    {error && <div className="mt-6"><ErrorNotice>{error}</ErrorNotice></div>}
    <section className="mt-8 grid gap-4 sm:grid-cols-3">
      {[
        { label: 'Job matches', value: loading ? '…' : String(profile ? getJobMatches(profile, jobs).length : 0), note: 'Based on your profile', to: '/jobs' },
        { label: 'Saved jobs', value: String(savedIds.length), note: 'Keep track of roles', to: '/jobs' },
        { label: 'Profile', value: profile ? 'Ready' : 'Complete', note: 'Used for jobs and your CV', to: '/profile' },
      ].map((item) => <Link key={item.label} to={item.to} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-forest/30">
        <p className="text-sm font-medium text-muted">{item.label}</p><p className="mt-2 text-2xl font-bold">{item.value}</p><p className="mt-1 text-xs text-muted">{item.note}</p>
      </Link>)}
    </section>
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-forest">Your recommendations</p><h2 className="mt-2 text-xl font-bold">A few roles to consider</h2></div><Link to="/jobs" className="text-sm font-semibold text-forest">View all matches ↗</Link></div>
      {loading ? <p className="py-10 text-sm text-muted">Loading your matches…</p> : matches.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{matches.map(({ job, match }) => <JobCard key={job.id} job={job} match={match} saved={savedIds.includes(job.id)} onToggleSaved={(jobId) => void toggleSaved(jobId)} />)}</div> :
        <div className="mt-5 rounded-2xl bg-[#eaf0eb] p-6 sm:p-8"><h3 className="font-bold">{profile ? 'No matching vacancies have been saved in this browser yet.' : 'Your next step starts with a complete profile.'}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{profile ? 'Search LinkedIn, Indeed and SAYouth for live openings. External vacancies open on their original platforms.' : 'Add the skills, qualifications, sectors and locations you’re interested in. We’ll rank vacancies against those details.'}</p><Link to={profile ? '/jobs' : '/profile'} className="mt-4 inline-flex rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white">{profile ? 'Search job platforms' : 'Complete my profile'}</Link></div>}
    </section>
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {[
        { title: 'Create or update your CV', description: 'Build a clean printable CV from your saved profile.', to: '/cv', label: 'Open CV builder' },
        { title: 'Apply for a public-service post', description: 'Review official vacancy circulars and the Z83 application checklist.', to: '/z83', label: 'Read Z83 guidance' },
        { title: 'Keep building your skills', description: 'Find free self-paced digital learning and career resources.', to: '/resources', label: 'Explore resources' },
      ].map((item) => <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{item.description}</p><Link to={item.to} className="mt-4 inline-flex text-sm font-semibold text-forest">{item.label} ↗</Link></article>)}
    </section>
  </main>
}
