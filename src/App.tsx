import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { SiteLayout } from './components/SiteLayout'
import { AuthPage, ProfilePage } from './pages/AuthPages'
import { Dashboard } from './pages/Dashboard'
import { JobsPage } from './pages/JobsPage'
import { LandingPage } from './pages/LandingPage'
import { ResourcesPage, Z83Page } from './pages/ResourcesPage'
import { CVPage } from './pages/CVPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">Loading your account…</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />
        <Route path="app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="cv" element={<ProtectedRoute><CVPage /></ProtectedRoute>} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="z83" element={<Z83Page />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
