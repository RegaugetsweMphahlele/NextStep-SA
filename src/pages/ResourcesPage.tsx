import { Link } from 'react-router-dom'

const courses = [
  { name: 'Microsoft Learn', topic: 'Technology, cloud and workplace skills', detail: 'Browse free guided learning paths at your own pace.', href: 'https://learn.microsoft.com/training/' },
  { name: 'Cisco Skills for All', topic: 'Networking, cybersecurity and digital skills', detail: 'Explore free introductory courses and practical learning content.', href: 'https://skillsforall.com/' },
  { name: 'SAYouth.mobi', topic: 'South African learning and work opportunities', detail: 'Find youth-focused opportunities and support across South Africa.', href: 'https://sayouth.mobi/' },
]

export function ResourcesPage() {
  return <main className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-forest">Career development</p>
    <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">Practical support for the work ahead.</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">Use these self-guided tools to strengthen your application, practise for interviews, keep learning and look after your wellbeing during a job search.</p>

    <section id="cv" className="mt-10 scroll-mt-6 rounded-3xl bg-forest p-6 text-white sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[.15em] text-lime">CV support</p><h2 className="mt-2 text-2xl font-bold">A clear CV begins with a clear profile.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Create a simple, printable CV using the contact, education, skills and summary details in your profile. Check every field and tailor your CV to the advert before sending it.</p></div>
        <Link to="/cv" className="inline-flex w-fit items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-forest">Open CV builder <span aria-hidden="true">↗</span></Link>
      </div>
      <ul className="mt-6 grid gap-3 border-t border-white/20 pt-5 text-sm text-white/85 sm:grid-cols-3">
        <li>Use a readable layout and consistent dates.</li><li>Lead with relevant skills and achievements.</li><li>Proofread, then save or print as a PDF.</li>
      </ul>
    </section>

    <section id="interview" className="mt-12 scroll-mt-6">
      <p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Interview preparation</p><h2 className="mt-2 text-2xl font-bold">Practise with a simple structure.</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="font-bold">Try the STAR approach</h3><dl className="mt-4 grid gap-3 text-sm">
          {[['Situation', 'Briefly explain the context.'], ['Task', 'What were you responsible for?'], ['Action', 'Describe the steps you personally took.'], ['Result', 'Share the outcome and what you learned.']].map(([term, detail]) => <div key={term} className="flex gap-3"><dt className="w-20 shrink-0 font-semibold text-forest">{term}</dt><dd className="text-muted">{detail}</dd></div>)}
        </dl></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="font-bold">Before the interview</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
          <li>Read the advert and note how your experience meets the essential requirements.</li><li>Prepare two or three honest examples of your work, study or community experience.</li><li>Check the interview format, time, venue or meeting link and prepare questions of your own.</li>
        </ul></article>
      </div>
    </section>

    <section id="learning" className="mt-12 scroll-mt-6">
      <p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Short courses and learning</p><h2 className="mt-2 text-2xl font-bold">Free resources to build your skills.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">These providers offer free resources or courses. Check each provider’s current access, language and certificate terms before enrolling.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">{courses.map((course) => <article key={course.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest">{course.topic}</p><h3 className="mt-2 text-lg font-bold">{course.name}</h3><p className="mt-2 flex-1 text-sm leading-6 text-muted">{course.detail}</p><a href={course.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest">Visit provider <span aria-hidden="true">↗</span></a>
      </article>)}</div>
    </section>

    <section id="wellbeing" className="mt-12 scroll-mt-6 rounded-3xl bg-[#f9e8e3] p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a84432]">Career wellbeing</p><h2 className="mt-2 text-2xl font-bold">Make the search manageable.</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[['Choose a small next step', 'Set a realistic target for today—such as updating one CV section or checking one carefully chosen advert.'], ['Keep a steady routine', 'Take breaks, make time for life outside applications and acknowledge progress, even when outcomes take time.'], ['Reach out for support', 'Talk with someone you trust, a mentor, campus career service or a qualified professional when you need support.']].map(([title, text]) => <article key={title} className="rounded-2xl bg-white/80 p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text}</p></article>)}
      </div>
      <p className="mt-5 text-xs leading-5 text-muted">This is general career-wellbeing guidance and is not a substitute for professional mental-health care.</p>
    </section>

    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Applying to government roles?</p><h2 className="mt-2 text-xl font-bold">Get help with the Z83 and public-service vacancies.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Use official vacancy notices, follow the exact advert instructions, and keep track of each closing date and reference number.</p></div><Link to="/z83" className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">Open Z83 guide <span aria-hidden="true">↗</span></Link></div>
    </section>
  </main>
}

export function Z83Page() {
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-forest">Public-service applications</p>
    <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">A practical guide to the Z83 form.</h1>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">The Z83 is used when applying for advertised South African public-service vacancies. The official Department of Public Service and Administration (DPSA) circular explains that applications should include a completed Z83, full particulars of training, qualifications, competencies, knowledge and experience, and the vacancy reference number.</p>

    <div className="mt-7 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-sky-950">
      <strong>Use the form and instructions in the official advert.</strong> Departments may specify where to get the current form, how to submit it, supporting documents, and the closing date. This guide does not submit an application or replace the official Z83.
    </div>

    <section className="mt-9">
      <h2 className="text-xl font-bold">Before you apply</h2>
      <ol className="mt-4 space-y-3">
        {[
          ['Read the full vacancy notice', 'Check the essential requirements, responsibilities, contact person, submission method and deadline.'],
          ['Record the reference number', 'Use the exact post title and reference number specified in the advert on your application.'],
          ['Complete the requested Z83 version', 'Follow the advert’s instructions and answer all applicable sections. Do not leave required fields blank.'],
          ['Prepare supporting information', 'Include your CV and the training, qualifications, competencies, knowledge and experience requested by the advert. Only certify documents if the advert asks you to.'],
          ['Submit to the advertising department', 'Send the application to the department named in the vacancy notice before its closing date. Keep a copy for your records.'],
        ].map(([title, text], index) => <li key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">{index + 1}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted">{text}</p></div></li>)}
      </ol>
    </section>

    <section className="mt-9 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-xl font-bold">Keep sensitive information safe</h2>
      <p className="mt-2 text-sm leading-6 text-muted">NextStep SA does not ask you to store your identity number, citizenship details, or other sensitive Z83 answers in your profile. Enter those details only on the official form when required, and submit them directly to the department through the method in the advert.</p>
    </section>

    <section className="mt-9 grid gap-4 sm:grid-cols-2">
      <a href="https://www.dpsa.gov.za/newsroom/psvc/" target="_blank" rel="noreferrer" className="rounded-2xl bg-forest p-6 text-white transition hover:bg-[#163f36]">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-lime">Official government source</p><h2 className="mt-2 text-xl font-bold">DPSA public-service vacancy circulars <span aria-hidden="true">↗</span></h2><p className="mt-2 text-sm leading-6 text-white/75">View circulars and read the official directions to candidates. Enquiries about individual vacancies go to the advertising department.</p>
      </a>
      <Link to="/profile" className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-forest/30">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Get application-ready</p><h2 className="mt-2 text-xl font-bold">Prepare your profile and CV <span aria-hidden="true">↗</span></h2><p className="mt-2 text-sm leading-6 text-muted">Keep your qualification and experience details together, then tailor the application for the post.</p>
      </Link>
    </section>
    <p className="mt-5 text-xs leading-5 text-muted">Source: <a className="underline underline-offset-2" href="https://www.dpsa.gov.za/newsroom/psvc/" target="_blank" rel="noreferrer">DPSA — Public service vacancy circular</a>. Always follow the latest advert issued by the relevant department.</p>
  </main>
}
