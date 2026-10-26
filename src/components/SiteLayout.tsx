import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="NextStep SA home">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${light ? 'bg-lime text-forest' : 'bg-forest text-lime'}`}>n.</span>
      <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>nextstep<span className={light ? 'text-lime' : 'text-forest'}>.sa</span></span>
    </Link>
  )
}

export function SiteLayout() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signOutError, setSignOutError] = useState('')

  async function handleSignOut() {
    setSignOutError('')
    try {
      await signOut()
      setMenuOpen(false)
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out. Please try again.')
    }
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-canvas text-forest' : 'text-slate-600 hover:text-forest'}`

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="bg-forest px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        Find opportunities that fit your experience, skills and goals.
        <Link to={user ? '/jobs' : '/signup'} className="ml-1 font-semibold text-lime underline underline-offset-2">Get started</Link>
      </div>
      <header className="relative z-20 border-b border-slate-200/70 bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Brand light />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <NavLink className={navClass} to="/jobs">Find jobs</NavLink>
            <NavLink className={navClass} to="/resources">Career support</NavLink>
            <NavLink className={navClass} to="/z83">Government applications</NavLink>
            {user && <NavLink className={navClass} to="/app">My dashboard</NavLink>}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link className="rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-white" to="/profile">My profile</Link>
                <button onClick={() => void handleSignOut()} className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163f36]">Sign out</button>
              </>
            ) : (
              <>
                <Link className="rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-white" to="/login">Log in</Link>
                <Link className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163f36]" to="/signup">Create an account <span aria-hidden="true">↗</span></Link>
              </>
            )}
          </div>
          <button onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 md:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={menuOpen ? 'm6 6 12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </div>
        {menuOpen && <nav className="absolute left-4 right-4 top-full flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-soft md:hidden" aria-label="Mobile navigation">
          <Link onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-canvas" to="/jobs">Find jobs</Link>
          <Link onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-canvas" to="/resources">Career support</Link>
          <Link onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-canvas" to="/z83">Government applications & Z83</Link>
          {user ? <><Link onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-canvas" to="/app">My dashboard</Link><button onClick={() => void handleSignOut()} className="rounded-lg bg-forest px-4 py-3 text-left text-sm font-semibold text-white">Sign out</button></> :
            <><Link onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-canvas" to="/login">Log in</Link><Link onClick={() => setMenuOpen(false)} className="rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-white" to="/signup">Create an account</Link></>}
        </nav>}
      </header>
      {signOutError && <p role="alert" className="mx-auto max-w-4xl px-4 py-3 text-sm text-red-700">{signOutError}</p>}
      <Outlet />
      <footer className="mt-16 border-t border-slate-200 bg-ink text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Brand />
          <p className="text-sm text-white/65">Career opportunities and support, built for South Africa.</p>
          <div className="flex gap-5 text-sm text-white/70"><Link className="hover:text-lime" to="/resources">Career support</Link><Link className="hover:text-lime" to="/z83">Z83 guide</Link></div>
        </div>
      </footer>
    </div>
  )
}
