import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const cardBase = {
  background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  borderRadius: '1.25rem',
}

const inputBase = {
  width: '100%',
  background: 'rgba(6,14,26,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem',
  padding: '0.75rem 1rem',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: 'border-box',
}

const onInputFocus = (e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)' }
const onInputBlur = (e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }

const btnBlue = {
  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
}
const onBtnEnter = (e) => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,130,246,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }
const onBtnLeave = (e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }

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
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '6rem 1.5rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '26rem' }}>

          <div style={{ ...cardBase, padding: '2.5rem' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '0.05em' }}>LW</span>
              </div>
              <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Welcome back</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Sign in to your LuxeWash account</p>
            </div>

            {error && (
              <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@email.com"
                  style={inputBase}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500 }}>Password</label>
                <Link to="/forgot-password" style={{ color: '#3B82F6', fontSize: '0.8125rem', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  style={inputBase}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ ...btnBlue, width: '100%', padding: '0.9375rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginTop: '0.25rem', opacity: loading ? 0.6 : 1 }}
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
