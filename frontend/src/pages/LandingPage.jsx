import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const services = [
  { id: 'basic',   icon: '🚿', name: 'Basic Wash',   price: 12, description: 'A thorough exterior rinse with premium soap, high-pressure wash, and air dry. Perfect for a quick refresh.',             features: ['Exterior rinse', 'Premium foam soap', 'High-pressure wash', 'Air dry'] },
  { id: 'deluxe',  icon: '✨', name: 'Deluxe Wash',  price: 22, description: 'Everything in Basic plus interior vacuuming and streak-free window cleaning inside and out.',                           features: ['Everything in Basic', 'Interior vacuum', 'Window cleaning', 'Dashboard wipe'] },
  { id: 'premium', icon: '💎', name: 'Premium Wash', price: 35, description: 'Our full-detail experience — hand wax, tire shine, leather conditioning, and complete interior detail.',               features: ['Everything in Deluxe', 'Hand wax & polish', 'Tire shine', 'Full interior detail'] },
]

const memberships = [
  { id: 'standard',     name: 'Standard',     price: 29, highlight: false, description: 'Great for everyday drivers who want a consistently clean car.',       includes: ['Unlimited Basic Washes', 'Priority booking', 'Member discounts'],                                              notIncluded: ['Deluxe & Premium access', 'Priority lane'] },
  { id: 'premium',      name: 'Premium',      price: 49, highlight: true,  description: 'Most popular — covers all your regular car care needs.',               includes: ['Unlimited Basic & Deluxe Washes', 'Interior vacuum included', 'Window cleaning', 'Priority booking'],        notIncluded: ['Premium Wash', 'Priority lane'] },
  { id: 'premium_plus', name: 'Premium Plus', price: 79, highlight: false, description: 'The ultimate LuxeWash experience — nothing held back.',               includes: ['Unlimited All Washes', 'Priority lane access', 'Free monthly full detail', 'Dedicated support'],            notIncluded: [] },
]

const testimonials = [
  { name: 'Sarah M.', initials: 'SM', rating: 5, text: 'LuxeWash is the only place I trust with my car. The Premium Plus membership is absolutely worth every penny.' },
  { name: 'James T.', initials: 'JT', rating: 5, text: 'Booked a Deluxe wash online in under a minute. Car came out spotless. Will never go anywhere else.' },
  { name: 'Priya K.', initials: 'PK', rating: 5, text: 'The staff is professional and the results are incredible. My car looks showroom-fresh every single time.' },
]

const steps = [
  { n: '01', title: 'Choose Your Service', desc: 'Pick from our wash packages or membership plans — no commitment required.' },
  { n: '02', title: 'Book a Time Slot',    desc: 'Select a date and time that works for you. Same-day slots often available.' },
  { n: '03', title: 'Drive In & Relax',   desc: 'Arrive at your appointment and let our expert team handle the rest.' },
]

const trustItems = [
  { icon: '⚡', label: 'Instant Booking' },
  { icon: '🌿', label: 'Eco-Friendly Products' },
  { icon: '🔒', label: 'Satisfaction Guaranteed' },
  { icon: '⭐', label: '5-Star Rated Service' },
  { icon: '🚗', label: 'Expert Technicians' },
  { icon: '💧', label: 'Water Recycling System' },
]

const BG    = '#f0efec'
const SURF  = '#e8e7e4'
const CARD  = '#ffffff'
const BDR   = 'rgba(0,0,0,0.09)'
const TEXT  = '#111111'
const MUTED = '#666666'
const DIM   = '#aaaaaa'
const G     = '#C8A96E'
const G2    = '#b89256'
const DARK  = '#111111'

export default function LandingPage() {
  const location = useLocation()
  const navigate  = useNavigate()

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [location])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const lbl  = { color: G, fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }
  const h2s  = { fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', fontWeight: 700, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1.1 }
  const subs = { color: MUTED, fontSize: '1rem', lineHeight: 1.75 }

  const darkBtn = (extra = {}) => ({
    padding: '0.875rem 2rem', background: DARK, color: '#f0efec', fontWeight: 700,
    fontSize: '0.9375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
    transition: 'all 0.2s ease', letterSpacing: '0.01em', ...extra,
  })
  const goldBtn = (extra = {}) => ({
    padding: '0.875rem 2rem', background: G, color: '#fff', fontWeight: 700,
    fontSize: '0.9375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
    transition: 'all 0.2s ease', letterSpacing: '0.01em', ...extra,
  })
  const ghostBtn = (extra = {}) => ({
    padding: '0.875rem 2rem', background: 'transparent', color: TEXT, fontWeight: 600,
    fontSize: '0.9375rem', borderRadius: '0.5rem', border: `1px solid ${BDR}`, cursor: 'pointer',
    transition: 'all 0.2s ease', ...extra,
  })

  const onDark  = (e) => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-2px)' }
  const offDark = (e) => { e.currentTarget.style.background = DARK;   e.currentTarget.style.transform = 'translateY(0)' }
  const onGold  = (e) => { e.currentTarget.style.background = G2; e.currentTarget.style.transform = 'translateY(-2px)' }
  const offGold = (e) => { e.currentTarget.style.background = G;  e.currentTarget.style.transform = 'translateY(0)' }

  return (
    <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden', color: TEXT }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8rem 5% 5rem', position: 'relative', overflow: 'hidden' }}>

        {/* Giant watermark */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <p style={{ fontSize: 'clamp(6rem, 18vw, 20rem)', fontWeight: 900, color: 'rgba(0,0,0,0.04)', letterSpacing: '-0.03em', lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap' }}>LUXEWASH</p>
        </div>

        {/* Animated car watermarks */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          {[
            { top: '16%',  size: '2.5rem',  duration: '22s', delay: '0s',    opacity: 0.18 },
            { top: '36%',  size: '1.75rem', duration: '30s', delay: '-9s',   opacity: 0.14 },
            { top: '54%',  size: '3rem',    duration: '18s', delay: '-4s',   opacity: 0.16 },
            { top: '70%',  size: '1.5rem',  duration: '35s', delay: '-17s',  opacity: 0.12 },
            { top: '84%',  size: '2.25rem', duration: '25s', delay: '-12s',  opacity: 0.15 },
            { top: '26%',  size: '1.5rem',  duration: '40s', delay: '-22s',  opacity: 0.10 },
          ].map((car, i) => (
            <span key={i} style={{
              position: 'absolute',
              top: car.top,
              fontSize: car.size,
              opacity: car.opacity,
              userSelect: 'none',
              animation: `car-drive ${car.duration} linear ${car.delay} infinite`,
            }}>🚗</span>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '80rem' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '2.5rem', height: '1px', background: G }} />
            <span style={lbl}>Premium Auto Care · Est. 2018</span>
          </div>

          <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', fontWeight: 800, lineHeight: 0.93, letterSpacing: '-0.04em', color: TEXT, marginBottom: '3rem' }}>
            Your Car<br />
            Deserves<br />
            <em style={{ fontStyle: 'italic', color: G }}>The Best.</em>
          </h1>

          <div className="reveal reveal-d2" style={{ display: 'flex', alignItems: 'flex-end', gap: '4rem', flexWrap: 'wrap' }}>
            <p style={{ ...subs, maxWidth: '28rem', margin: 0 }}>
              Professional car wash and detailing that leaves your vehicle looking showroom-fresh. Book in minutes, results that last.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', flexShrink: 0 }}>
              <button style={darkBtn()}
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={onDark} onMouseLeave={offDark}>
                Book a Wash →
              </button>
              <button style={ghostBtn()}
                onClick={() => document.getElementById('memberships')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = BDR }}>
                View Plans
              </button>
            </div>
          </div>

          <div className="reveal reveal-d3" style={{ display: 'flex', gap: '4rem', marginTop: '5rem', paddingTop: '2.5rem', borderTop: `1px solid ${BDR}`, flexWrap: 'wrap' }}>
            {[{ v: '5,000+', l: 'Happy Members' }, { v: '8+', l: 'Years in Business' }, { v: '99.99%', l: 'Satisfaction Rate' }].map(s => (
              <div key={s.l}>
                <p style={{ fontSize: '2.5rem', fontWeight: 700, color: TEXT, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.375rem' }}>{s.v}</p>
                <p style={{ color: MUTED, fontSize: '0.8125rem', fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`, padding: '1rem 0', overflow: 'hidden', background: SURF }}>
        <div className="marquee-track" style={{ display: 'flex', width: 'max-content' }}>
          {[...trustItems, ...trustItems].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', color: MUTED, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, padding: '0 2.5rem' }}>
              <span style={{ color: G }}>{item.icon}</span>
              {item.label}
              <span style={{ color: DIM, marginLeft: '1.5rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section id="services" style={{ padding: '3rem 5% 6rem', backgroundColor: BG }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', gap: '2rem', flexWrap: 'wrap', paddingBottom: '2rem', borderBottom: `1px solid ${BDR}` }}>
            <div>
              <p style={{ ...lbl, display: 'block', marginBottom: '0.75rem' }}>What We Offer</p>
              <h2 style={h2s}>Our Services</h2>
            </div>
            <p style={{ ...subs, maxWidth: '26rem' }}>One-time wash services with no commitment. Pick what you need, pay only for that.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {services.map((service, i) => (
              <div key={service.id} className={`reveal reveal-d${i + 1}`}
                style={{ padding: '2.5rem', position: 'relative', display: 'flex', flexDirection: 'column', background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <span style={{ position: 'absolute', top: '1.5rem', right: '2rem', fontSize: '4.5rem', fontWeight: 900, color: 'rgba(0,0,0,0.04)', lineHeight: 1, letterSpacing: '-0.05em', userSelect: 'none' }}>0{i + 1}</span>
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                  {service.icon}
                </div>
                <h3 style={{ color: TEXT, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.625rem' }}>{service.name}</h3>
                <p style={{ color: MUTED, fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{service.description}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1, marginBottom: '1.5rem' }}>
                  {service.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#555', fontSize: '0.875rem' }}>
                      <span style={{ color: G, fontSize: '0.5rem', lineHeight: 1, flexShrink: 0 }}>◆</span> {f}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: `1px solid ${BDR}`, marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: TEXT, letterSpacing: '-0.04em' }}>${service.price}</span>
                    <span style={{ color: DIM, fontSize: '0.8125rem', marginLeft: '0.375rem' }}>one-time</span>
                  </div>
                  <button onClick={() => navigate('/checkout/service', { state: { preselected: service.id } })}
                    style={{ padding: '0.5rem 1.125rem', background: DARK, color: '#f0efec', fontWeight: 700, fontSize: '0.8125rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: '0.02em' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.transform = 'translateY(0)' }}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ padding: '6rem 5%', backgroundColor: SURF }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ ...lbl, display: 'block', marginBottom: '0.75rem' }}>Simple Process</p>
              <h2 style={h2s}>How It Works</h2>
            </div>
            <p style={{ ...subs, maxWidth: '24rem' }}>Three simple steps and you&apos;re done.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem' }}>
            {steps.map((step, i) => (
              <div key={step.title} className={`reveal reveal-d${i + 1}`}>
                <p style={{ fontSize: '4rem', fontWeight: 800, color: 'rgba(200,169,110,0.35)', letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '1.5rem' }}>{step.n}</p>
                <h3 style={{ color: TEXT, fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: MUTED, fontSize: '0.875rem', lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIPS ──────────────────────────────────── */}
      <section id="memberships" style={{ padding: '3rem 5% 6rem', backgroundColor: BG }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ ...lbl, display: 'block', marginBottom: '0.875rem' }}>Save More</p>
            <h2 style={h2s}>Membership Plans</h2>
            <p style={{ ...subs, maxWidth: '30rem', margin: '1rem auto 0' }}>Unlimited washes, exclusive perks, and the best value for regular drivers.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
            {memberships.map((plan, i) => (
              <div key={plan.id} className={`reveal reveal-d${i + 1}`}
                style={{
                  position: 'relative', padding: '2rem', borderRadius: '0.875rem',
                  display: 'flex', flexDirection: 'column',
                  background: CARD,
                  border: plan.highlight ? `2px solid ${G}` : `1px solid ${BDR}`,
                  boxShadow: plan.highlight ? '0 8px 40px rgba(200,169,110,0.15)' : 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = plan.highlight ? '0 16px 56px rgba(200,169,110,0.3)' : '0 8px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = plan.highlight ? '0 8px 40px rgba(200,169,110,0.15)' : 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-0.875rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                    <span style={{ background: G, color: '#fff', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ color: TEXT, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{plan.name}</h3>
                  <p style={{ color: MUTED, fontSize: '0.8125rem', lineHeight: 1.65 }}>{plan.description}</p>
                </div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${BDR}` }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 700, color: plan.highlight ? G : TEXT, letterSpacing: '-0.04em' }}>${plan.price}</span>
                  <span style={{ color: DIM, fontSize: '0.875rem', marginLeft: '0.5rem' }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flexGrow: 1 }}>
                  {plan.includes.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#555', fontSize: '0.875rem' }}>
                      <span style={{ flexShrink: 0, lineHeight: 1 }}>🚗</span> <span>{item}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#bbb', fontSize: '0.875rem' }}>
                      <span style={{ color: '#ccc', marginTop: '2px', flexShrink: 0 }}>✕</span> <span style={{ textDecoration: 'line-through' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/checkout/membership', { state: { preselected: plan.id } })}
                  style={plan.highlight
                    ? { width: '100%', padding: '0.875rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff', background: G, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: '0.02em' }
                    : { width: '100%', padding: '0.875rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: TEXT, background: 'transparent', border: `1px solid ${BDR}`, cursor: 'pointer', transition: 'all 0.2s ease' }
                  }
                  onMouseEnter={plan.highlight
                    ? e => { e.currentTarget.style.background = G2; e.currentTarget.style.transform = 'translateY(-1px)' }
                    : e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }
                  }
                  onMouseLeave={plan.highlight
                    ? e => { e.currentTarget.style.background = G; e.currentTarget.style.transform = 'translateY(0)' }
                    : e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = BDR }
                  }
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section style={{ padding: '6rem 5%', backgroundColor: SURF }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '3.5rem' }}>
            <p style={{ ...lbl, display: 'block', marginBottom: '0.875rem' }}>Reviews</p>
            <h2 style={h2s}>What Our Members Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className={`reveal reveal-d${i + 1}`}
                style={{ padding: '2rem', border: `1px solid ${BDR}`, borderRadius: '0.875rem', background: CARD, display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ color: G, fontSize: '3.5rem', lineHeight: 0.8, marginBottom: '1rem', fontFamily: 'Georgia, serif', opacity: 0.6, userSelect: 'none' }}>&ldquo;</div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, j) => <span key={j} style={{ color: G, fontSize: '0.8125rem' }}>★</span>)}
                </div>
                <p style={{ color: '#444', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1.5rem', fontStyle: 'italic', flexGrow: 1 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${BDR}` }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <span style={{ color: TEXT, fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (dark contrast section) ──────────────────── */}
      <section style={{ padding: '6rem 5%', background: '#111111', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(6rem, 18vw, 18rem)', fontWeight: 900, color: 'rgba(255,255,255,0.03)', letterSpacing: '-0.03em', lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          BOOK NOW
        </div>
        <div style={{ maxWidth: '60rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '2rem', height: '1px', background: G }} />
            <span style={{ ...lbl, color: G }}>Get Started Today</span>
            <div style={{ width: '2rem', height: '1px', background: G }} />
          </div>
          <h2 className="reveal reveal-d1" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#f0efec', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.25rem' }}>
            Ready to Experience<br />
            <em style={{ fontStyle: 'italic', color: G }}>the Difference?</em>
          </h2>
          <p className="reveal reveal-d2" style={{ color: '#888', fontSize: '1.0625rem', marginBottom: '2.5rem', lineHeight: 1.75, maxWidth: '30rem', margin: '0 auto 2.5rem' }}>
            Join thousands of happy customers. Book your first wash today and see why we&apos;re the city&apos;s most trusted car care service.
          </p>
          <button className="reveal reveal-d3" style={goldBtn({ padding: '1rem 2.5rem', fontSize: '1rem' })}
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={onGold} onMouseLeave={offGold}>
            Book Your Wash →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}