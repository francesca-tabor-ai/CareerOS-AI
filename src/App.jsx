import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import CaseStudies from './pages/CaseStudies'
import Contact from './pages/Contact'
import ApiDocs from './pages/ApiDocs'
import Marketplace from './pages/Marketplace'
import BuildApp from './pages/BuildApp'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/apps/build" element={<BuildApp />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  )
}

export default App
