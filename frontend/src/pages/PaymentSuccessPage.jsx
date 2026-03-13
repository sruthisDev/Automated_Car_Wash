import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SERVICE_LABELS = { basic: 'Basic Wash', deluxe: 'Deluxe Wash', premium: 'Premium Wash' }
const PLAN_LABELS = { standard: 'Standard', premium: 'Premium', premium_plus: 'Premium Plus' }

const cardBase = {
  background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
  borderRadius: '1rem',
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
      <span style={{ color: '#94A3B8' }}>{label}</span>
      <span style={{ color: '#fff' }}>{value}</span>
    </div>
  )
}

export default function PaymentSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result
  const emailSentRef = useRef(false)

  useEffect(() => {
    if (!result) { navigate('/'); return }
    if (!emailSentRef.current) {
      emailSentRef.current = true
      axios.post('/api/payments/send-confirmation', result).catch(() => {})
    }
  }, [result, navigate])

  if (!result) return null

  const isService = result.type === 'service'

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '36rem', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>

        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '5rem', height: '5rem', borderRadius: '9999px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 0 30px rgba(34,197,94,0.15)' }}>
            <svg width="28" height="28" fill="none" stroke="#4ade80" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Payment Successful!
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem' }}>
            Thank you, <span style={{ color: '#fff', fontWeight: 500 }}>{result.customer_name}</span>.{' '}
            {isService ? 'Your booking is confirmed.' : 'Your membership is now active.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
            <svg width="15" height="15" fill="none" stroke="#3B82F6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
              Confirmation sent to <span style={{ color: '#fff' }}>{result.customer_email}</span>
            </p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div style={{ ...cardBase, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>Order Summary</h2>
            {isService && <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>Ref: #{result.booking_ref}</span>}
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {isService ? (
              <>
                <Row label="Service" value={SERVICE_LABELS[result.service] || result.service} />
                <Row label="Date" value={result.appointment_date} />
                <Row label="Time" value={result.appointment_time} />
                <Row label="Customer" value={result.customer_name} />
                <Row label="Email" value={result.customer_email} />
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <Row label="Subtotal" value={`$${result.price?.toFixed(2)}`} />
                  <Row label="Tax (9%)" value={`$${result.tax?.toFixed(2)}`} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ color: '#94A3B8' }}>Total Paid</span>
                    <span style={{ color: '#60a5fa', fontSize: '1.125rem' }}>${result.total?.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Row label="Plan" value={PLAN_LABELS[result.plan] || result.plan} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#94A3B8' }}>Status</span>
                  <span style={{ color: '#4ade80', fontWeight: 500 }}>Active</span>
                </div>
                <Row label="Billing" value="Monthly" />
                <Row label="Renews On" value={result.renews_at} />
                <Row label="Customer" value={result.customer_name} />
                <Row label="Email" value={result.customer_email} />
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span style={{ color: '#94A3B8' }}>Amount Paid</span>
                    <span style={{ color: '#60a5fa', fontSize: '1.125rem' }}>${result.price?.toFixed(2)}/mo</span>
                  </div>
                </div>
              </>
            )}

            {result.card_last4 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: '0.875rem' }}>
                <span style={{ color: '#94A3B8' }}>Payment Method</span>
                <span style={{ color: '#fff' }}>{result.card_brand?.toUpperCase()} •••• {result.card_last4}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard"
            style={{ flex: 1, padding: '0.875rem', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 4px 20px rgba(59,130,246,0.35)', borderRadius: '0.875rem', color: '#fff', fontWeight: 600, fontSize: '0.9375rem', textAlign: 'center', textDecoration: 'none', minWidth: '140px' }}>
            Go to Dashboard
          </Link>
          <Link to="/"
            style={{ flex: 1, padding: '0.875rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.875rem', color: '#fff', fontWeight: 600, fontSize: '0.9375rem', textAlign: 'center', textDecoration: 'none', minWidth: '140px' }}>
            Back to Home
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  )
}
