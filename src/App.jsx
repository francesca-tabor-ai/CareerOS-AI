import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/Layout'
import AppDashboardLayout from './components/app/AppDashboardLayout'
import AppGuard from './pages/app/AppGuard'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import CaseStudies from './pages/CaseStudies'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ApiDocs from './pages/ApiDocs'
import Marketplace from './pages/Marketplace'
import BuildApp from './pages/BuildApp'
import AdminLogin from './pages/admin/AdminLogin'
import Admin from './pages/Admin'
import CareerOSApp from './pages/CareerOSApp'
import Dashboard from './pages/app/Dashboard'
import Jobs from './pages/app/Jobs'
import Applications from './pages/app/Applications'
import ApplicationDetail from './pages/app/ApplicationDetail'
import Insights from './pages/app/Insights'
import Profile from './pages/app/Profile'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Admin />} />
      <Route path="/app" element={<AppGuard />}>
        <Route path="classic" element={<CareerOSApp />} />
        <Route element={<AppDashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="insights" element={<Insights />} />
        </Route>
      </Route>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
      <Route path="/case-studies" element={<Layout><CaseStudies /></Layout>} />
      <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
      <Route path="/apps/build" element={<Layout><BuildApp /></Layout>} />
      <Route path="/api-docs" element={<Layout><ApiDocs /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
      <Route path="/terms" element={<Layout><Terms /></Layout>} />
      <Route path="/404" element={<Layout><NotFound /></Layout>} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    </>
  )
}

export default App
