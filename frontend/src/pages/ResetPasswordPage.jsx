import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />
        <p style={{ color: '#f87171' }}>Invalid reset link. <Link to="/forgot-password" style={{ color: '#3B82F6' }}>Request a new one</Link></p>
      </div>
    )
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
              <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Set new password</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Enter your new password below</p>
            </div>

            {success ? (
              <div style={{ padding: '1.25rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.75rem', color: '#4ade80', fontSize: '0.875rem', textAlign: 'center' }}>
                ✅ Password reset successful! Redirecting to login...
              </div>
            ) : (
              <>
                {error && (
                  <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem' }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>New Password</label>
                    <input
                      type="password" required value={form.new_password}
                      onChange={e => setForm({ ...form, new_password: e.target.value })}
                      placeholder="••••••••" style={inputBase}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Confirm Password</label>
                    <input
                      type="password" required value={form.confirm_password}
                      onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                      placeholder="••••••••" style={inputBase}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ ...btnBlue, width: '100%', padding: '0.9375rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', opacity: loading ? 0.6 : 1 }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,130,246,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
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