import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function CVPage() {
  const { profile, user, profileError } = useAuth()
  if (!profile) return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><div className="rounded-2xl border border-slate-200 bg-white p-7"><h1 className="text-2xl font-bold">Your CV starts with your profile.</h1><p className="mt-2 text-sm leading-6 text-muted">{profileError || 'Add your education, skills and career summary to prepare a printable CV draft.'}</p><Link to="/profile" className="mt-5 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">Complete my profile</Link></div></main>
  return <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">CV builder</p><h1 className="mt-1 text-2xl font-bold">Your profile-based CV draft</h1></div><div className="flex gap-2"><Link to="/profile" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold">Edit details</Link><button onClick={() => window.print()} className="rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white">Print / save as PDF</button></div></div>
    <article className="cv-sheet rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-12">
      <header className="border-b-2 border-forest pb-5">
        <h2 className="font-display text-3xl font-bold text-ink">{profile.full_name}</h2>
        <p className="mt-2 text-sm text-muted">{[profile.phone, user?.email, profile.province].filter(Boolean).join(' · ')}</p>
      </header>
      {profile.professional_summary && <section className="mt-6"><h3 className="text-xs font-bold uppercase tracking-[.15em] text-forest">Professional summary</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{profile.professional_summary}</p></section>}
      <section className="mt-6"><h3 className="text-xs font-bold uppercase tracking-[.15em] text-forest">Education</h3><p className="mt-2 font-semibold">{profile.qualification}</p><p className="mt-1 text-sm text-muted">{profile.education_level}</p></section>
      {profile.work_experience && <section className="mt-6"><h3 className="text-xs font-bold uppercase tracking-[.15em] text-forest">Experience</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{profile.work_experience}</p></section>}
      {profile.skills.length > 0 && <section className="mt-6"><h3 className="text-xs font-bold uppercase tracking-[.15em] text-forest">Skills</h3><p className="mt-2 text-sm leading-6 text-slate-700">{profile.skills.join(' · ')}</p></section>}
      {profile.interests.length > 0 && <section className="mt-6"><h3 className="text-xs font-bold uppercase tracking-[.15em] text-forest">Career interests</h3><p className="mt-2 text-sm leading-6 text-slate-700">{profile.interests.join(' · ')}</p></section>}
      <section className="mt-8 border-t border-slate-200 pt-4 print:hidden"><p className="text-xs leading-5 text-muted">This is a starter draft based on your profile. Add any missing dates, responsibilities, achievements and references before applying. Tailor it to each vacancy and verify your details.</p></section>
    </article>
  </main>
}
