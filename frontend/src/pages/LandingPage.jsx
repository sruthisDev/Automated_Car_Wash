import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const services = [
  { id: 'basic', icon: '🚿', name: 'Basic Wash', price: 12, description: 'A thorough exterior rinse with premium soap, high-pressure wash, and air dry. Perfect for a quick refresh.', features: ['Exterior rinse', 'Premium foam soap', 'High-pressure wash', 'Air dry'] },
  { id: 'deluxe', icon: '✨', name: 'Deluxe Wash', price: 22, description: 'Everything in Basic plus interior vacuuming and streak-free window cleaning inside and out.', features: ['Everything in Basic', 'Interior vacuum', 'Window cleaning', 'Dashboard wipe'] },
  { id: 'premium', icon: '💎', name: 'Premium Wash', price: 35, description: 'Our full-detail experience — hand wax, tire shine, leather conditioning, and complete interior detail.', features: ['Everything in Deluxe', 'Hand wax & polish', 'Tire shine', 'Full interior detail'] },
]

const memberships = [
  { id: 'standard', name: 'Standard', price: 29, highlight: false, description: 'Great for everyday drivers who want a consistently clean car.', includes: ['Unlimited Basic Washes', 'Priority booking', 'Member discounts'], notIncluded: ['Deluxe & Premium access', 'Priority lane'] },
  { id: 'premium', name: 'Premium', price: 49, highlight: true, description: 'Most popular — covers all your regular car care needs.', includes: ['Unlimited Basic & Deluxe Washes', 'Interior vacuum included', 'Window cleaning', 'Priority booking'], notIncluded: ['Premium Wash', 'Priority lane'] },
  { id: 'premium_plus', name: 'Premium Plus', price: 79, highlight: false, description: 'The ultimate LuxeWash experience — nothing held back.', includes: ['Unlimited All Washes', 'Priority lane access', 'Free monthly full detail', 'Dedicated support'], notIncluded: [] },
]

const testimonials = [
  { name: 'Sarah M.', rating: 5, text: 'LuxeWash is the only place I trust with my car. The Premium Plus membership is absolutely worth every penny.' },
  { name: 'James T.', rating: 5, text: 'Booked a Deluxe wash online in under a minute. Car came out spotless. Will never go anywhere else.' },
  { name: 'Priya K.', rating: 5, text: 'The staff is professional and the results are incredible. My car looks showroom-fresh every single time.' },
]

const cardBase = {
  background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
  transition: 'all 0.25s ease',
}

const onCardEnter = (e) => {
  e.currentTarget.style.border = '1px solid rgba(59,130,246,0.4)'
  e.currentTarget.style.boxShadow = '0 8px 40px rgba(59,130,246,0.15), 0 4px 24px rgba(0,0,0,0.4)'
  e.currentTarget.style.transform = 'translateY(-4px)'
}
const onCardLeave = (e) => {
  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)'
  e.currentTarget.style.transform = 'translateY(0)'
}

const btnBlue = {
  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}
const onBtnEnter = (e) => {
  e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,130,246,0.55)'
  e.currentTarget.style.transform = 'translateY(-1px)'
}
const onBtnLeave = (e) => {
  e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.35)'
  e.currentTarget.style.transform = 'translateY(0)'
}

function CheckIcon() {
  return (
    <svg style={{ width: '1rem', height: '1rem', color: '#3B82F6', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg style={{ width: '1rem', height: '1rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Background layers */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 70%), linear-gradient(180deg, #0A1628 0%, #0d1f3c 50%, #0A1628 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', top: '33%', left: '25%', width: '18rem', height: '18rem', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8rem', background: 'linear-gradient(to bottom, transparent, #0A1628)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '56rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <div className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#3B82F6' }} />
            <span style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.025em' }}>Premium Auto Care — Est. 2018</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#fff', marginBottom: '1.5rem' }}>
            The Cleanest Ride
            <br />
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              in Town
            </span>
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '1.125rem', lineHeight: 1.75, maxWidth: '40rem', margin: '0 auto 2.5rem' }}>
            Professional car wash and detailing services that leave your vehicle looking showroom-fresh. Book in minutes, results that last.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ ...btnBlue, padding: '1rem 2rem', fontWeight: 600, borderRadius: '0.75rem', fontSize: '1rem', color: '#fff' }}
              onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
            >
              Book a Wash
            </button>
            <button
              onClick={() => document.getElementById('memberships')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '1rem 2rem', fontWeight: 600, borderRadius: '0.75rem', fontSize: '1rem', color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent' }}
            >
              View Memberships
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[{ value: '5,000+', label: 'Happy Members' }, { value: '8+', label: 'Years in Business' }, { value: '99.99%', label: 'Satisfaction Rate' }].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</p>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: '0.25rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────── */}
      <section id="services" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>What We Offer</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Our Services</h2>
            <p style={{ color: '#94A3B8', fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto' }}>One-time wash services with no commitment. Pick what you need, pay only for that.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {services.map(service => (
              <div key={service.id} style={{ ...cardBase, borderRadius: '1rem', padding: '2rem' }} onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1.25rem' }}>{service.icon}</div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{service.name}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{service.description}</p>

                <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                  {service.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.625rem' }}>
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff' }}>${service.price}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.875rem', marginLeft: '0.375rem' }}>one-time</span>
                  </div>
                  <button
                    onClick={() => navigate('/checkout/service', { state: { preselected: service.id } })}
                    style={{ ...btnBlue, padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}
                    onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIPS ──────────────────────────────── */}
      <section id="memberships" style={{ padding: '6rem 1.5rem', background: 'linear-gradient(180deg, #060e1a 0%, #0A1628 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Save More</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Membership Plans</h2>
            <p style={{ color: '#94A3B8', fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto' }}>Unlimited washes, exclusive perks, and the best value for regular drivers.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {memberships.map(plan => (
              <div key={plan.id} style={{
                position: 'relative',
                borderRadius: '1rem',
                padding: '2rem',
                transition: 'all 0.25s ease',
                ...(plan.highlight
                  ? { background: 'linear-gradient(145deg, #0F2040, #132a50)', border: '1px solid rgba(59,130,246,0.5)', boxShadow: '0 8px 40px rgba(59,130,246,0.2), 0 4px 24px rgba(0,0,0,0.4)' }
                  : cardBase)
              }}
                onMouseEnter={!plan.highlight ? onCardEnter : undefined}
                onMouseLeave={!plan.highlight ? onCardLeave : undefined}
              >
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)' }}>
                    <span style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 2px 12px rgba(59,130,246,0.4)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 1rem', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{plan.name}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{plan.description}</p>

                <div style={{ marginBottom: '2rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>${plan.price}</span>
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem', marginLeft: '0.5rem' }}>/month</span>
                </div>

                <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                  {plan.includes.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      <CheckIcon /> {item}
                    </li>
                  ))}
                  {plan.notIncluded.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      <XIcon /> {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/checkout/membership', { state: { preselected: plan.id } })}
                  style={{
                    width: '100%', padding: '0.875rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                    ...(plan.highlight ? btnBlue : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' })
                  }}
                  onMouseEnter={plan.highlight ? onBtnEnter : e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={plan.highlight ? onBtnLeave : e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Reviews</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>What Our Members Say</h2>
            <p style={{ color: '#94A3B8', fontSize: '1.125rem' }}>Trusted by thousands of happy drivers.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ ...cardBase, borderRadius: '1rem', padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1.25rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: '#facc15', fontSize: '1.125rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
