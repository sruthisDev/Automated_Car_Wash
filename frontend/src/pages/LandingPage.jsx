import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const services = [
  { id: 'basic',   icon: '🚿', name: 'Basic Wash',   price: 12, description: 'A thorough exterior rinse with premium soap, high-pressure wash, and air dry. Perfect for a quick refresh.',                                               features: ['Exterior rinse', 'Premium foam soap', 'High-pressure wash', 'Air dry'] },
  { id: 'deluxe',  icon: '✨', name: 'Deluxe Wash',  price: 22, description: 'Everything in Basic plus interior vacuuming and streak-free window cleaning inside and out.',                                                             features: ['Everything in Basic', 'Interior vacuum', 'Window cleaning', 'Dashboard wipe'] },
  { id: 'premium', icon: '💎', name: 'Premium Wash', price: 35, description: 'Our full-detail experience — hand wax, tire shine, leather conditioning, and complete interior detail.',                                                 features: ['Everything in Deluxe', 'Hand wax & polish', 'Tire shine', 'Full interior detail'] },
]

const memberships = [
  { id: 'standard',    name: 'Standard',     price: 29, highlight: false, description: 'Great for everyday drivers who want a consistently clean car.',         includes: ['Unlimited Basic Washes', 'Priority booking', 'Member discounts'],                                                              notIncluded: ['Deluxe & Premium access', 'Priority lane'] },
  { id: 'premium',     name: 'Premium',      price: 49, highlight: true,  description: 'Most popular — covers all your regular car care needs.',                includes: ['Unlimited Basic & Deluxe Washes', 'Interior vacuum included', 'Window cleaning', 'Priority booking'],                        notIncluded: ['Premium Wash', 'Priority lane'] },
  { id: 'premium_plus',name: 'Premium Plus', price: 79, highlight: false, description: 'The ultimate LuxeWash experience — nothing held back.',                includes: ['Unlimited All Washes', 'Priority lane access', 'Free monthly full detail', 'Dedicated support'],                            notIncluded: [] },
]

const testimonials = [
  { name: 'Sarah M.', initials: 'SM', rating: 5, text: 'LuxeWash is the only place I trust with my car. The Premium Plus membership is absolutely worth every penny.' },
  { name: 'James T.', initials: 'JT', rating: 5, text: 'Booked a Deluxe wash online in under a minute. Car came out spotless. Will never go anywhere else.' },
  { name: 'Priya K.', initials: 'PK', rating: 5, text: 'The staff is professional and the results are incredible. My car looks showroom-fresh every single time.' },
]

const steps = [
  { icon: '📱', title: 'Choose Your Service', desc: 'Pick from our wash packages or membership plans — no commitment required.' },
  { icon: '📅', title: 'Book a Time Slot',    desc: 'Select a date and time that works for you. Same-day slots often available.' },
  { icon: '🚗', title: 'Drive In & Relax',   desc: 'Arrive at your appointment and let our expert team handle the rest.' },
]

const trustItems = [
  { icon: '⚡', label: 'Instant Booking' },
  { icon: '🌿', label: 'Eco-Friendly Products' },
  { icon: '🔒', label: 'Satisfaction Guaranteed' },
  { icon: '⭐', label: '5-Star Rated Service' },
]

function CheckIcon() {
  return (
    <svg style={{ width: '0.875rem', height: '0.875rem', color: '#3B82F6', flexShrink: 0, marginTop: '1px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg style={{ width: '0.875rem', height: '0.875rem', color: 'rgba(255,255,255,0.18)', flexShrink: 0, marginTop: '1px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function LandingPage() {
  const location = useLocation()
  const navigate = useNavigate()

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

  const glass = {
    background: 'rgba(12, 24, 48, 0.65)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '1rem',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }
  const onCardHover = (e) => {
    e.currentTarget.style.border = '1px solid rgba(59,130,246,0.35)'
    e.currentTarget.style.boxShadow = '0 20px 60px rgba(59,130,246,0.12), 0 8px 24px rgba(0,0,0,0.35)'
    e.currentTarget.style.transform = 'translateY(-6px)'
  }
  const onCardOut = (e) => {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.transform = 'translateY(0)'
  }
  const btn = {
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600,
    borderRadius: '0.75rem', transition: 'all 0.25s ease',
    boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
  }
  const onBtnIn  = (e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.55)' }
  const onBtnOut = (e) => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.3)' }

  const sectionLabel = { color: '#3B82F6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }
  const sectionHeading = { fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', marginBottom: '1rem' }
  const sectionSub = { color: '#94A3B8', fontSize: '1.0625rem', maxWidth: '34rem', margin: '0 auto', lineHeight: 1.7 }

  return (
    <div style={{ minHeight: '100vh', background: '#060d1a', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '4rem' }}>

        {/* Animated orbs */}
        <div className="orb-1" style={{ position: 'absolute', top: '12%', left: '8%',  width: '32rem', height: '32rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div className="orb-2" style={{ position: 'absolute', top: '25%', right: '5%', width: '26rem', height: '26rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div className="orb-3" style={{ position: 'absolute', bottom: '20%', left: '30%', width: '22rem', height: '22rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.035) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '14rem', background: 'linear-gradient(to bottom, transparent, #060d1a)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '60rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>

          {/* Badge */}
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2rem', padding: '0.375rem 1rem 0.375rem 0.625rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', backdropFilter: 'blur(8px)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: 'rgba(59,130,246,0.2)' }}>
              <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6', display: 'block' }} />
            </span>
            <span style={{ color: '#93c5fd', fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.02em' }}>Premium Auto Care · Est. 2018</span>
          </div>

          {/* Headline */}
          <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(2.75rem, 8vw, 5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#fff', marginBottom: '1.5rem' }}>
            Your Car Deserves
            <br />
            <span className="shimmer-gradient">The Best Care</span>
          </h1>

          <p className="reveal reveal-d2" style={{ color: '#94A3B8', fontSize: '1.125rem', lineHeight: 1.8, maxWidth: '38rem', margin: '0 auto 2.5rem' }}>
            Professional car wash and detailing that leaves your vehicle looking showroom-fresh. Book in minutes, results that last.
          </p>

          <div className="reveal reveal-d3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center' }}>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ ...btn, padding: '0.875rem 2rem', fontSize: '0.9375rem' }}
              onMouseEnter={onBtnIn} onMouseLeave={onBtnOut}>
              Book a Wash →
            </button>
            <button onClick={() => document.getElementById('memberships')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '0.875rem 2rem', fontWeight: 600, borderRadius: '0.75rem', fontSize: '0.9375rem', color: '#e2e8f0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.25s ease', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}>
              View Memberships
            </button>
          </div>

          {/* Stats */}
          <div className="reveal reveal-d4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[{ value: '5,000+', label: 'Happy Members' }, { value: '8+', label: 'Years in Business' }, { value: '99.99%', label: 'Satisfaction Rate' }].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>{s.value}</p>
                <p style={{ color: '#475569', fontSize: '0.8125rem', marginTop: '0.25rem', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────── */}
      <section style={{ padding: '0 1.5rem 2.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className="reveal" style={{ ...glass, padding: '1.5rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            {trustItems.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', padding: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────── */}
      <section id="services" style={{ padding: '1.5rem 1.5rem 3.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={sectionLabel}>What We Offer</p>
            <h2 style={sectionHeading}>Our Services</h2>
            <p style={sectionSub}>One-time wash services with no commitment. Pick what you need, pay only for that.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {services.map((service, i) => (
              <div key={service.id} className={`reveal reveal-d${i + 1}`} style={{ ...glass, padding: '2rem', display: 'flex', flexDirection: 'column' }} onMouseEnter={onCardHover} onMouseLeave={onCardOut}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  {service.icon}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.1875rem', fontWeight: 700, marginBottom: '0.5rem' }}>{service.name}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>{service.description}</p>
                <ul style={{ listStyle: 'none', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', flexGrow: 1 }}>
                  {service.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>${service.price}</span>
                    <span style={{ color: '#475569', fontSize: '0.8125rem', marginLeft: '0.375rem' }}>one-time</span>
                  </div>
                  <button onClick={() => navigate('/checkout/service', { state: { preselected: service.id } })}
                    style={{ ...btn, padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
                    onMouseEnter={onBtnIn} onMouseLeave={onBtnOut}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem 3.5rem', background: 'linear-gradient(180deg, #060d1a 0%, #080f1f 50%, #060d1a 100%)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={sectionLabel}>Simple Process</p>
            <h2 style={sectionHeading}>How It Works</h2>
            <p style={{ ...sectionSub, maxWidth: '32rem' }}>Getting your car cleaned has never been easier. Three simple steps and you're done.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {steps.map((step, i) => (
              <div key={step.title} className={`reveal reveal-d${i + 1}`} style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4.5rem', height: '4.5rem', borderRadius: '50%', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{step.icon}</span>
                  <span style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 800, color: '#fff', boxShadow: '0 2px 8px rgba(59,130,246,0.5)' }}>
                    {i + 1}
                  </span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIPS ───────────────────────────── */}
      <section id="memberships" style={{ padding: '1.5rem 1.5rem 3.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={sectionLabel}>Save More</p>
            <h2 style={sectionHeading}>Membership Plans</h2>
            <p style={sectionSub}>Unlimited washes, exclusive perks, and the best value for regular drivers.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            {memberships.map((plan, i) => (
              <div key={plan.id} className={`reveal reveal-d${i + 1}`}
                style={{
                  position: 'relative',
                  ...glass,
                  padding: '2rem',
                  ...(plan.highlight ? {
                    background: 'rgba(18, 38, 76, 0.8)',
                    border: '1px solid rgba(59,130,246,0.4)',
                    boxShadow: '0 0 0 1px rgba(59,130,246,0.08), 0 24px 60px rgba(59,130,246,0.15)',
                  } : {})
                }}
                onMouseEnter={!plan.highlight ? onCardHover : undefined}
                onMouseLeave={!plan.highlight ? onCardOut : undefined}
              >
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-0.875rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                    <span style={{ ...btn, padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.07em', display: 'inline-block' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.375rem' }}>{plan.name}</h3>
                  <p style={{ color: '#64748B', fontSize: '0.8125rem', lineHeight: 1.6 }}>{plan.description}</p>
                </div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>${plan.price}</span>
                  <span style={{ color: '#475569', fontSize: '0.875rem', marginLeft: '0.5rem' }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {plan.includes.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                      <CheckIcon /> <span>{item}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>
                      <XIcon /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/checkout/membership', { state: { preselected: plan.id } })}
                  style={{
                    width: '100%', padding: '0.875rem', borderRadius: '0.75rem', fontSize: '0.875rem',
                    fontWeight: 600, color: '#fff', cursor: 'pointer', transition: 'all 0.25s ease',
                    ...(plan.highlight
                      ? { background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', border: 'none', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' })
                  }}
                  onMouseEnter={plan.highlight ? onBtnIn : e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={plan.highlight ? onBtnOut : e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem 3.5rem', background: 'linear-gradient(180deg, #060d1a 0%, #080f1f 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={sectionLabel}>Reviews</p>
            <h2 style={sectionHeading}>What Our Members Say</h2>
            <p style={{ ...sectionSub, maxWidth: '28rem' }}>Trusted by thousands of happy drivers across the city.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className={`reveal reveal-d${i + 1}`} style={{ ...glass, padding: '2rem' }} onMouseEnter={onCardHover} onMouseLeave={onCardOut}>
                <div style={{ color: '#3B82F6', fontSize: '4rem', lineHeight: 1, marginBottom: '0.25rem', fontFamily: 'Georgia, serif', opacity: 0.4, userSelect: 'none', letterSpacing: '-0.05em' }}>&ldquo;</div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: '#FBBF24', fontSize: '0.875rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '1.5rem', fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div className="reveal" style={{ position: 'relative', borderRadius: '1.5rem', padding: '4rem 3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(124,58,237,0.14) 100%)', border: '1px solid rgba(59,130,246,0.22)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-3rem',   right: '-3rem', width: '14rem', height: '14rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '12rem', height: '12rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ ...sectionHeading, marginBottom: '1rem' }}>Ready to Experience the Difference?</h2>
              <p style={{ color: '#94A3B8', fontSize: '1.0625rem', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '32rem', margin: '0 auto 2rem' }}>
                Join thousands of happy customers. Book your first wash today and see why we're the city's most trusted car care service.
              </p>
              <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ ...btn, padding: '1rem 2.5rem', fontSize: '1rem' }}
                onMouseEnter={onBtnIn} onMouseLeave={onBtnOut}>
                Book Your Wash →
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}