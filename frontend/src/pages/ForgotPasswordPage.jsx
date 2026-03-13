import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const cardBase = {
  background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  borderRadius: '1.25rem',
}
const inputBase = {
  width: '100%', background: 'rgba(6,14,26,0.8)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.875rem',
  outline: 'none', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box',
}
const btnBlue = {
  background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
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
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '6rem 1.5rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '26rem' }}>
          <div style={{ ...cardBase, padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9375rem' }}>LW</span>
              </div>
              <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Forgot password?</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Enter your email and we'll send you a reset link</p>
            </div>

            {status === 'success' ? (
              <div style={{ padding: '1.25rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.75rem', color: '#4ade80', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                ✅ If that email is registered, a reset link has been sent. Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="john@email.com" style={inputBase}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ ...btnBlue, width: '100%', padding: '0.9375rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', opacity: loading ? 0.6 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,130,246,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem', marginTop: '1.5rem' }}>
              <Link to="/login" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>← Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}