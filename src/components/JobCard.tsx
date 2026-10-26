import type { JobPosting } from '../types'

type JobCardProps = {
  job: JobPosting
  match?: number
  saved?: boolean
  onToggleSaved?: (jobId: string) => void
}

export function JobCard({ job, match, saved, onToggleSaved }: JobCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-forest/25 hover:shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf0eb] text-sm font-bold text-forest">{job.employer.slice(0, 1).toUpperCase()}</span>
        {typeof match === 'number' && <span className="rounded-full bg-lime/60 px-2.5 py-1 text-xs font-semibold text-forest">{match}% match</span>}
        {onToggleSaved && <button type="button" onClick={() => onToggleSaved(job.id)} aria-pressed={saved} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${saved ? 'bg-[#f9e8e3] text-[#a84432]' : 'bg-canvas text-slate-600 hover:text-forest'}`}>{saved ? 'Saved' : 'Save'}</button>}
      </div>
      <p className="mt-5 text-xs font-semibold text-muted">{job.employer}</p>
      <h3 className="mt-1 text-lg font-bold tracking-tight">{job.title}</h3>
      <p className="mt-2 text-sm text-muted">{job.location}{job.province ? ` · ${job.province}` : ''}</p>
      <p className="mt-4 text-sm leading-6 text-slate-600">{job.description}</p>
      <div className="my-5 border-t border-slate-100" />
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-canvas px-3 py-1.5 text-xs font-medium text-slate-600">{job.employment_type}</span>
        <span className="rounded-full bg-canvas px-3 py-1.5 text-xs font-medium text-slate-600">{job.sector}</span>
      </div>
      <div className="mt-auto pt-5">
        {job.application_deadline && <p className="mb-3 text-xs text-muted">Apply by {new Date(`${job.application_deadline}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
        <a href={job.source_url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#163f36]">View original advert <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  )
}
