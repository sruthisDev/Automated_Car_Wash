import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'

const cardBase = {
  background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
  borderRadius: '1rem',
  transition: 'all 0.25s ease',
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

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await axios.post('/api/contact', form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      {/* Page Header */}
      <section style={{ padding: '8rem 1.5rem 3rem', textAlign: 'center' }}>
        <p style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          Contact Us
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Get In Touch
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1.125rem', maxWidth: '30rem', margin: '0 auto' }}>
          We&apos;re here to help — reach out anytime and we&apos;ll get back to you within 24 hours.
        </p>
      </section>

      {/* Contact Info Cards */}
      <section style={{ padding: '1rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '📞', title: 'Call Us', lines: ['+1 (555) 123-4567', 'Mon–Sat: 8am – 7pm'], href: 'tel:+15551234567' },
            { icon: '📧', title: 'Email Us', lines: ['hello@luxewash.com', 'We reply within 24 hours'], href: 'mailto:hello@luxewash.com' },
          ].map(card => (
            <a key={card.title} href={card.href} style={{ ...cardBase, padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.375rem' }}>
                {card.icon}
              </div>
              <div>
                <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.375rem', fontSize: '0.9375rem' }}>{card.title}</h3>
                {card.lines.map(line => (
                  <p key={line} style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6 }}>{line}</p>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <div style={{ ...cardBase, padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>Send a Message</h2>

            {status === 'success' && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.75rem', color: '#4ade80', fontSize: '0.875rem' }}>
                ✅ Message sent! We&apos;ll get back to you within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem' }}>
                Something went wrong. Please try again or call us directly.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
                { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@email.com' },
                { label: 'Subject', name: 'subject', type: 'text', placeholder: 'How can we help?' },
              ].map(field => (
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
              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us more..."
                  style={{ ...inputBase, resize: 'none', lineHeight: 1.6 }}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{ ...btnBlue, width: '100%', padding: '0.9375rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', opacity: status === 'loading' ? 0.6 : 1 }}
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map + Location */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{ ...cardBase, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '16rem', background: 'rgba(6,14,26,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.75rem' }}>📍</span>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Map embed goes here</p>
                <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.25rem' }}>(Add Google Maps iframe in production)</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '📍', text: '123 Shine Ave, Suite 100\nCity, State 00000' },
                { icon: '📞', text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                { icon: '🕐', text: 'Mon–Sat: 8am–7pm\nSun: 9am–5pm' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', marginTop: '0.1rem' }}>{item.icon}</span>
                  {item.href
                    ? <a href={item.href} style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line', textDecoration: 'none' }}>{item.text}</a>
                    : <span style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.text}</span>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
