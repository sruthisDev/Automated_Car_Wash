import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const BG    = '#f0efec'
const CARD  = '#ffffff'
const BDR   = 'rgba(0,0,0,0.09)'
const TEXT  = '#111111'
const MUTED = '#666666'
const G     = '#C8A96E'

const inputBase = {
  width: '100%',
  background: BG,
  border: `1px solid ${BDR}`,
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  color: TEXT,
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: 'border-box',
}
const onInputFocus = (e) => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.6)' }
const onInputBlur  = (e) => { e.currentTarget.style.borderColor = BDR }

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.redirectTo || '/'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', form)
      localStorage.setItem('lw_token', data.token)
      localStorage.setItem('lw_user', JSON.stringify(data.user))
      navigate(redirectTo)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
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

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '9999px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '0.05em' }}>LW</span>
              </div>
              <h1 style={{ color: TEXT, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Welcome back</h1>
              <p style={{ color: MUTED, fontSize: '0.875rem' }}>Sign in to your LuxeWash account</p>
            </div>

            {error && (
              <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@email.com" style={inputBase} onFocus={onInputFocus} onBlur={onInputBlur} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ color: MUTED, fontSize: '0.8125rem', fontWeight: 500 }}>Password</label>
                  <Link to="/forgot-password" style={{ color: G, fontSize: '0.8125rem', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
                </div>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" style={inputBase} onFocus={onInputFocus} onBlur={onInputBlur} />
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '0.9375rem', background: '#111111', color: '#f0efec', fontWeight: 700, fontSize: '0.9375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', marginTop: '0.25rem', opacity: loading ? 0.6 : 1 }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#333' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#111111' }}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: BDR }} />
              <span style={{ color: '#aaa', fontSize: '0.75rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: BDR }} />
            </div>

            <p style={{ textAlign: 'center', color: MUTED, fontSize: '0.875rem' }}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" style={{ color: G, fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}