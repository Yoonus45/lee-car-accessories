import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Gallery from './pages/Gallery'
import Booking from './pages/Booking'
import About from './pages/About'
import Contact from './pages/Contact'
import Reviews from './pages/Reviews'
import SeatCovers from './pages/SeatCovers'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/admin/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Wrapper for admin routes — no Navbar/Footer
function AdminLayout() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin routes — completely separate layout */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Customer-facing routes — with Navbar + Footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main style={{ flex: 1, paddingBottom: 10, overflowX: 'hidden', width: '100%' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/seat-covers" element={<SeatCovers />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/reviews" element={<Reviews />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
