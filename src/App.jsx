import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoadingAnimation from './components/LoadingAnimation.jsx'

const SiteLayout = lazy(() => import('./layouts/SiteLayout.jsx'))
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function RouteFallback({ minHeight = '60vh' }) {
  return (
    <div 
      className="fixed inset-0 bg-[var(--color-cream)] z-50 flex items-center justify-center" 
      style={{ minHeight }}
      aria-hidden="true"
    >
      <LoadingAnimation type="solar" size="large" text="Loading solar experience..." />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </Suspense>
  )
}

export default App
