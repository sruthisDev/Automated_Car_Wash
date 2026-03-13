import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const BG    = '#f0efec'
const CARD  = '#ffffff'
const BDR   = 'rgba(0,0,0,0.09)'
const TEXT  = '#111111'
const MUTED = '#666666'
const G     = '#C8A96E'

const inputBase = {
  width: '100%', background: BG, border: `1px solid ${BDR}`,
  borderRadius: '0.5rem', padding: '0.75rem 1rem', color: TEXT, fontSize: '0.875rem',
  outline: 'none', transition: 'border-color 0.2s', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box',
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password', { email })
      setStatus('success')
    } catch {
      setStatus('success') // always show success to avoid email enumeration
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '6rem 1.5rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '26rem' }}>
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '9999px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9375rem' }}>LW</span>
              </div>
              <h1 style={{ color: TEXT, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Forgot password?</h1>
              <p style={{ color: MUTED, fontSize: '0.875rem' }}>Enter your email and we&apos;ll send you a reset link</p>
            </div>

            {status === 'success' ? (
              <div style={{ padding: '1.25rem', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '0.5rem', color: '#16a34a', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                ✅ If that email is registered, a reset link has been sent. Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="john@email.com" style={inputBase}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.6)'}
                    onBlur={e => e.currentTarget.style.borderColor = BDR}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '0.9375rem', background: '#111111', color: '#f0efec', fontWeight: 700, fontSize: '0.9375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', opacity: loading ? 0.6 : 1 }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#333' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#111111' }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <p style={{ textAlign: 'center', color: MUTED, fontSize: '0.875rem', marginTop: '1.5rem' }}>
              <Link to="/login" style={{ color: G, fontWeight: 600, textDecoration: 'none' }}>← Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}