import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ChatBot from './components/ChatBot'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ServiceCheckoutPage from './pages/ServiceCheckoutPage'
import MembershipCheckoutPage from './pages/MembershipCheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const CARS = [
  { top: '8%',  size: '1.75rem', duration: '28s', delay: '0s',    opacity: 0.07 },
  { top: '22%', size: '1.5rem',  duration: '38s', delay: '-12s',  opacity: 0.06 },
  { top: '38%', size: '2rem',    duration: '22s', delay: '-6s',   opacity: 0.07 },
  { top: '54%', size: '1.5rem',  duration: '34s', delay: '-20s',  opacity: 0.05 },
  { top: '68%', size: '1.75rem', duration: '26s', delay: '-9s',   opacity: 0.06 },
  { top: '82%', size: '1.5rem',  duration: '42s', delay: '-15s',  opacity: 0.05 },
  { top: '15%', size: '1.25rem', duration: '48s', delay: '-30s',  opacity: 0.04 },
  { top: '92%', size: '2rem',    duration: '20s', delay: '-4s',   opacity: 0.06 },
]

function App() {
  return (
    <Router>
      {/* Global animated cars — fixed, behind all page content */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {CARS.map((car, i) => (
          <span key={i} style={{
            position: 'absolute',
            top: car.top,
            fontSize: car.size,
            opacity: car.opacity,
            userSelect: 'none',
            animation: `car-drive ${car.duration} linear ${car.delay} infinite`,
          }}>🚗</span>
        ))}
      </div>
      <ScrollToTop />
      <ChatBot />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/checkout/service" element={<ServiceCheckoutPage />} />
        <Route path="/checkout/membership" element={<MembershipCheckoutPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  )
}

export default App
