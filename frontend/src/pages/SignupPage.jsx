import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export default function SignupPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address'); return }
    if (form.password !== form.confirm_password) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/signup', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      })
      localStorage.setItem('lw_token', data.token)
      localStorage.setItem('lw_user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'John Doe' },
    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@email.com' },
    { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 8 characters' },
    { label: 'Confirm Password', name: 'confirm_password', type: 'password', placeholder: '••••••••' },
  ]

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
              <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Create your account</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Join LuxeWash today</p>
            </div>

            {error && (
              <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              {fields.map(field => (
                <div key={field.name}>
                  <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    style={inputBase}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                style={{ ...btnBlue, width: '100%', padding: '0.9375rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginTop: '0.25rem', opacity: loading ? 0.6 : 1 }}
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
