import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import CartToast from './components/CartToast'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'

import Home from './pages/Home'
import Services from './pages/Services'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
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

// Wrapper for admin routes — no Navbar/Footer/BottomNav
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

// Customer-facing layout wrapper — renders Navbar, Content, conditional Footer (Contact page only), and Bottom Navigation
function CustomerLayout() {
  const { pathname } = useLocation()
  const isContactPage = pathname === '/contact'

  return (
    <>
      <Navbar />
      <main className="customer-main-content" style={{ flex: 1, width: '100%' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/seat-covers" element={<SeatCovers />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </main>
      {isContactPage && <Footer />}
      <BottomNav />
      <CartToast />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin routes — completely separate layout without customer navigation */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Customer-facing routes */}
            <Route path="/*" element={<CustomerLayout />} />
          </Routes>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
