import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const SiteLayout = lazy(() => import('./layouts/SiteLayout.jsx'))
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function RouteFallback() {
  return <div className="min-h-screen bg-[var(--color-cream)]" aria-hidden="true" />
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
