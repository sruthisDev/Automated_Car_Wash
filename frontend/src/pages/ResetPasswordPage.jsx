import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [form, setForm] = useState({ new_password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.new_password !== form.confirm_password) { setError('Passwords do not match'); return }
    if (form.new_password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await axios.post('/api/auth/reset-password', { token, new_password: form.new_password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />
        <p style={{ color: '#dc2626' }}>Invalid reset link. <Link to="/forgot-password" style={{ color: G }}>Request a new one</Link></p>
      </div>
    )
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
              <h1 style={{ color: TEXT, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Set new password</h1>
              <p style={{ color: MUTED, fontSize: '0.875rem' }}>Enter your new password below</p>
            </div>

            {success ? (
              <div style={{ padding: '1.25rem', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '0.5rem', color: '#16a34a', fontSize: '0.875rem', textAlign: 'center' }}>
                ✅ Password reset successful! Redirecting to login...
              </div>
            ) : (
              <>
                {error && (
                  <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  <div>
                    <label style={{ display: 'block', color: MUTED, fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>New Password</label>
                    <input
                      type="password" required value={form.new_password}
                      onChange={e => setForm({ ...form, new_password: e.target.value })}
                      placeholder="••••••••" style={inputBase}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = BDR}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: MUTED, fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Confirm Password</label>
                    <input
                      type="password" required value={form.confirm_password}
                      onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                      placeholder="••••••••" style={inputBase}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = BDR}
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ width: '100%', padding: '0.9375rem', background: '#111111', color: '#f0efec', fontWeight: 700, fontSize: '0.9375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', opacity: loading ? 0.6 : 1 }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#333' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#111111' }}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
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