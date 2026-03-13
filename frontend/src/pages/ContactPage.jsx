import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'

const BG    = '#f0efec'
const SURF  = '#e8e7e4'
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const lbl = { color: G, fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }

  return (
    <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <Navbar />

      {/* Page Header */}
      <section style={{ padding: '8rem 5% 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <p style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', fontWeight: 900, color: 'rgba(0,0,0,0.04)', letterSpacing: '-0.03em', lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap' }}>CONTACT</p>
        </div>
        <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '2.5rem', height: '1px', background: G }} />
            <span style={lbl}>Get In Touch</span>
          </div>
          <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, color: TEXT, marginBottom: '1.5rem' }}>
            Let&apos;s<br /><em style={{ fontStyle: 'italic', color: G }}>Talk.</em>
          </h1>
          <p className="reveal reveal-d2" style={{ color: MUTED, fontSize: '1.125rem', maxWidth: '30rem', lineHeight: 1.75 }}>
            We&apos;re here to help — reach out anytime and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ padding: '0 5% 3rem', backgroundColor: BG }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '📞', title: 'Call Us',   lines: ['+1 (555) 123-4567', 'Mon–Sat: 8am – 7pm'], href: 'tel:+15551234567' },
            { icon: '📧', title: 'Email Us',  lines: ['hello@luxewash.com', 'We reply within 24 hours'], href: 'mailto:hello@luxewash.com' },
          ].map((card, i) => (
            <a key={card.title} href={card.href} className={`reveal reveal-d${i + 1}`}
              style={{ padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', textDecoration: 'none', background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '0.625rem', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.375rem' }}>
                {card.icon}
              </div>
              <div>
                <h3 style={{ color: TEXT, fontWeight: 600, marginBottom: '0.375rem', fontSize: '0.9375rem' }}>{card.title}</h3>
                {card.lines.map(line => (
                  <p key={line} style={{ color: MUTED, fontSize: '0.875rem', lineHeight: 1.6 }}>{line}</p>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '2rem 5% 5rem', backgroundColor: BG }}>
        <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <div className="reveal" style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', padding: '2.5rem' }}>
            <p style={{ ...lbl, display: 'block', marginBottom: '0.625rem' }}>Send a Message</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: TEXT, marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>We&apos;d Love to Hear From You</h2>

            {status === 'success' && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.5rem', color: '#16a34a', fontSize: '0.875rem' }}>
                ✅ Message sent! We&apos;ll get back to you within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
                Something went wrong. Please try again or call us directly.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'Full Name',      name: 'name',    type: 'text',  placeholder: 'John Doe' },
                { label: 'Email Address',  name: 'email',   type: 'email', placeholder: 'john@email.com' },
                { label: 'Subject',        name: 'subject', type: 'text',  placeholder: 'How can we help?' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>{field.label}</label>
                  <input
                    name={field.name} type={field.type} value={form[field.name]}
                    onChange={handleChange} required placeholder={field.placeholder}
                    style={inputBase} onFocus={onInputFocus} onBlur={onInputBlur}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  required rows={5} placeholder="Tell us more..."
                  style={{ ...inputBase, resize: 'none', lineHeight: 1.6 }}
                  onFocus={onInputFocus} onBlur={onInputBlur}
                />
              </div>
              <button type="submit" disabled={status === 'loading'}
                style={{ width: '100%', padding: '0.9375rem', background: '#111111', color: '#f0efec', fontWeight: 700, fontSize: '0.9375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: '0.01em', opacity: status === 'loading' ? 0.6 : 1 }}
                onMouseEnter={e => { if (status !== 'loading') { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                onMouseLeave={e => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.transform = 'translateY(0)' }}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map + Location */}
      <section style={{ padding: '0 5% 6rem', backgroundColor: SURF }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div className="reveal" style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '16rem', background: SURF, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BDR}` }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.75rem' }}>📍</span>
                <p style={{ color: MUTED, fontSize: '0.875rem' }}>Map embed goes here</p>
                <p style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '0.25rem' }}>(Add Google Maps iframe in production)</p>
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
                    ? <a href={item.href} style={{ color: MUTED, fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line', textDecoration: 'none' }}>{item.text}</a>
                    : <span style={{ color: MUTED, fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.text}</span>
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