import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const learningLinks = [
  { provider: 'Microsoft Learn', detail: 'Free, self-paced technology and business learning paths.', url: 'https://learn.microsoft.com/training/' },
  { provider: 'Cisco Skills for All', detail: 'Free introductory courses in networking, cybersecurity and digital skills.', url: 'https://skillsforall.com/' },
  { provider: 'SAYouth.mobi', detail: 'A South African network connecting young people to learning and work opportunities.', url: 'https://sayouth.mobi/' },
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

export function LandingPage() {
  const { user } = useAuth()

  return (
    <main>
      <div className="mx-auto max-w-5xl px-5 pt-4 sm:px-8">
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-muted"><strong className="text-ink">Browser-only demo:</strong> accounts, profiles, saved jobs and vacancies stay in this browser; they are not shared with other users or devices.</p>
      </div>
      <section className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 lg:grid-cols-[1.04fr_.96fr] lg:gap-12 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="max-w-[610px]">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white px-3.5 py-2 text-xs font-semibold text-forest shadow-sm sm:text-sm"><span className="h-2 w-2 rounded-full bg-coral" /> Career support, made for South Africa</p>
          <h1 className="font-display text-[clamp(3.2rem,7.1vw,6rem)] font-semibold leading-[.97] tracking-[-.065em]">Your next step<br />starts <span className="relative inline-block text-forest">with you<span className="absolute -bottom-1 left-0 h-2 w-full -rotate-2 rounded-full bg-lime sm:-bottom-2 sm:h-3" /></span>.</h1>
          <p className="mt-7 max-w-[520px] text-base leading-7 text-muted sm:text-lg sm:leading-8">Find work that fits your skills and qualifications. Build a stronger CV, prepare for interviews and get practical support along the way.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={user ? '/jobs' : '/signup'} className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#163f36]">{user ? 'See your job matches' : 'Create your free profile'} <Arrow /></Link>
            <a href="#how-matching" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-forest/40 hover:text-forest">Explore how matching works</a>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">No made-up recommendations: job matches use your profile and published vacancy details.</p>
        </div>
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-lime/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[#e7ebe4] sm:rounded-[2.5rem]">
            <img className="h-[370px] w-full object-cover sm:h-[470px]" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85" alt="Colleagues collaborating around a table" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-white/95 p-5 shadow-soft backdrop-blur sm:bottom-7 sm:left-7 sm:right-7">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-forest">One profile. A more focused search.</p>
              <p className="mt-2 text-base font-semibold leading-6">Your qualifications, skills, location and career interests help shape the roles you see.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-matching" className="scroll-mt-6 border-y border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-0 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
          {[
            ['01', 'Find relevant work', 'Match published job adverts against the experience and interests in your profile.'],
            ['02', 'Get application-ready', 'Create a CV from your profile and get practical interview and Z83 guidance.'],
            ['03', 'Keep building', 'Explore free learning resources and career-wellbeing support at your own pace.'],
          ].map(([step, title, description], index) => <article key={step} className={`py-7 md:px-6 md:py-9 ${index > 0 ? 'border-t border-slate-200 md:border-l md:border-t-0' : ''}`}>
            <p className="text-xs font-bold tracking-[.15em] text-forest">{step} <span className="mx-1 text-slate-300">/</span> NEXT STEP</p>
            <h2 className="mt-3 text-lg font-bold">{title}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
          </article>)}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-forest">Support for the whole journey</p><h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Useful tools. Clear next steps.</h2></div>
          <Link className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest hover:gap-3" to="/resources">Explore career support <Arrow /></Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Job matching', text: 'Get recommendations based on your skills, qualifications and preferred locations.', to: '/jobs', label: 'Build your profile' },
            { title: 'CV revamp', text: 'Turn your profile into a clean, print-ready CV and improve it with a practical checklist.', to: '/cv', label: 'Create a CV' },
            { title: 'Interview prep', text: 'Prepare examples, thoughtful questions and a calm plan for interview day.', to: '/resources#interview', label: 'Get prepared' },
            { title: 'Government jobs', text: 'Understand the Z83 form, official vacancy circulars and what to attach.', to: '/z83', label: 'Read the Z83 guide' },
          ].map((item) => <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="font-bold">{item.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-muted">{item.text}</p>
            <Link className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest" to={item.to}>{item.label} <Arrow /></Link>
          </article>)}
        </div>
      </section>

      <section className="bg-[#eaf0eb]">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-forest">Keep learning, for free</p><h2 className="font-display text-3xl font-semibold tracking-tight">Take a skill further.</h2><p className="mt-2 text-sm text-muted">A few trusted places to start learning online at no cost.</p></div>
            <Link to="/resources" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest">More resources <Arrow /></Link>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {learningLinks.map((link) => <a key={link.provider} href={link.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white bg-white/75 p-5 transition hover:bg-white">
              <span className="text-xs font-semibold uppercase tracking-wide text-forest">Free learning</span><h3 className="mt-2 font-bold">{link.provider} <Arrow /></h3><p className="mt-2 text-sm leading-6 text-muted">{link.detail}</p>
            </a>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-forest px-6 py-9 text-white sm:px-10 sm:py-11 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-lime">A practical place to begin</p><h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-tight sm:text-3xl">Create a profile once. Use it to guide the next step.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/75">Your profile powers matching and gives you a head start on your CV. You can edit it whenever your goals change.</p></div>
          <Link to={user ? '/profile' : '/signup'} className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-forest transition hover:bg-white">{user ? 'Update your profile' : 'Create your profile'} <Arrow /></Link>
        </div>
      </section>
    </main>
  )
}
