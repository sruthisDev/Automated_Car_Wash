import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const values = [
  { icon: '✅', title: 'Quality',  desc: 'We never cut corners on your vehicle. Every wash meets our premium standard.' },
  { icon: '🌿', title: 'Eco-Care', desc: 'Water-saving equipment and biodegradable products in every service.' },
  { icon: '⚡', title: 'Speed',    desc: 'In and out in under 15 minutes — without sacrificing quality.' },
  { icon: '🤝', title: 'Trust',    desc: 'Transparent pricing, no hidden fees. Ever.' },
  { icon: '💎', title: 'Premium',  desc: 'Luxury-level results at an honest, accessible price.' },
]

const team = [
  { name: 'James L.', role: 'Founder & CEO',            initial: 'J', exp: '8+ yrs', bio: 'James launched LuxeWash in 2018 with a single bay and an obsession for perfection. His vision — premium results at honest prices — remains the foundation of everything we do.',              tags: ['Leadership', 'Strategy'] },
  { name: 'Maria K.', role: 'Operations Manager',        initial: 'M', exp: '6 yrs',  bio: "Maria owns the day-to-day at our location — from scheduling and staffing to quality audits. If things run like clockwork, it's because Maria built the clock.",                             tags: ['Operations', 'Training'] },
  { name: 'Ryan T.',  role: 'Head of Detailing',         initial: 'R', exp: '12 yrs', bio: 'Ryan brings 12 years of professional detailing expertise to every vehicle. Hand-polish, interior restoration, ceramic coating — he has seen it all and perfected it all.',                  tags: ['Detailing', 'Ceramic Coat'] },
  { name: 'Sofia P.', role: 'Customer Experience Lead',  initial: 'S', exp: '4 yrs',  bio: 'Sofia ensures every customer leaves happier than they arrived. She oversees our loyalty programme, handles feedback, and makes sure no concern goes unanswered.',                           tags: ['Customer Care', 'Loyalty'] },
]

const stats = [
  { value: '5,000+', label: 'Happy Members' },
  { value: '8+',     label: 'Years in Business' },
  { value: '1',      label: 'Location' },
  { value: '99%',    label: 'Satisfaction Rate' },
]

const BG    = '#f0efec'
const SURF  = '#e8e7e4'
const CARD  = '#ffffff'
const BDR   = 'rgba(0,0,0,0.09)'
const TEXT  = '#111111'
const MUTED = '#666666'
const G     = '#C8A96E'
const G2    = '#b89256'

export default function AboutPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const lbl = { color: G, fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }
  const h2s = { fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1.1 }

  return (
    <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <Navbar />

      {/* Page Header */}
      <section style={{ padding: '8rem 5% 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <p style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', fontWeight: 900, color: 'rgba(0,0,0,0.04)', letterSpacing: '-0.03em', lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap' }}>ABOUT US</p>
        </div>
        <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '2.5rem', height: '1px', background: G }} />
            <span style={lbl}>Our Story</span>
          </div>
          <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, color: TEXT, marginBottom: '1.5rem' }}>
            About<br /><em style={{ fontStyle: 'italic', color: G }}>LuxeWash.</em>
          </h1>
          <p className="reveal reveal-d2" style={{ color: MUTED, fontSize: '1.125rem', maxWidth: '32rem', lineHeight: 1.75 }}>
            More than a car wash — a commitment to quality, community, and results that speak for themselves.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: '0 5% 6rem', backgroundColor: BG }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div className="reveal reveal-d1"
            style={{ padding: '3rem', minHeight: '18rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem' }}>
            🚗
          </div>
          <div className="reveal reveal-d2">
            <p style={{ ...lbl, display: 'block', marginBottom: '0.875rem' }}>The Beginning</p>
            <h2 style={{ ...h2s, marginBottom: '1.25rem' }}>Our Story</h2>
            <p style={{ color: MUTED, lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9375rem' }}>
              Founded in 2018, LuxeWash started as a single-bay operation with one simple belief — every car deserves a showroom finish. What began as a passion for detail grew into a full-service auto care destination trusted by thousands of members.
            </p>
            <p style={{ color: MUTED, lineHeight: 1.8, fontSize: '0.9375rem' }}>
              Today, from our purpose-built facility, LuxeWash combines cutting-edge equipment with eco-friendly products to deliver a premium experience every single time. We focus on one location so we can focus entirely on you.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section style={{ padding: '6rem 5%', backgroundColor: SURF }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ ...lbl, display: 'block', marginBottom: '0.75rem' }}>What We Stand For</p>
              <h2 style={h2s}>Our Values</h2>
            </div>
            <p style={{ color: MUTED, maxWidth: '22rem', fontSize: '0.9375rem', lineHeight: 1.7 }}>What we stand for, every single day.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {values.map((v, i) => (
              <div key={v.title} className={`reveal reveal-d${i + 1}`}
                style={{ padding: '1.75rem', background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{v.icon}</div>
                <h3 style={{ color: TEXT, fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ color: MUTED, fontSize: '0.875rem', lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section style={{ padding: '6rem 5%', backgroundColor: BG }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ ...lbl, display: 'block', marginBottom: '0.75rem' }}>The People</p>
              <h2 style={h2s}>Meet the Team</h2>
            </div>
            <p style={{ color: MUTED, fontSize: '0.9375rem' }}>The people behind every spotless vehicle.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {team.map((member, i) => (
              <div key={member.name} className={`reveal reveal-d${i + 1}`}
                style={{ padding: '1.75rem', textAlign: 'center', background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ position: 'relative', width: '5rem', margin: '0 auto 1.125rem' }}>
                  <div style={{ width: '5rem', height: '5rem', borderRadius: '9999px', background: 'rgba(200,169,110,0.1)', border: '2px solid rgba(200,169,110,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontWeight: 700, fontSize: '1.5rem' }}>
                    {member.initial}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: '-4px', background: G, borderRadius: '9999px', padding: '2px 7px', fontSize: '0.625rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                    {member.exp}
                  </div>
                </div>
                <h3 style={{ color: TEXT, fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.2rem' }}>{member.name}</h3>
                <p style={{ color: G, fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.875rem' }}>{member.role}</p>
                <p style={{ color: MUTED, fontSize: '0.8125rem', lineHeight: 1.65, marginBottom: '1rem', textAlign: 'left' }}>{member.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                  {member.tags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)', color: G, fontSize: '0.6875rem', fontWeight: 600, padding: '3px 9px', borderRadius: '9999px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '5rem 5%', backgroundColor: SURF }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`reveal reveal-d${i + 1}`}
              style={{ padding: '2rem', background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: G, letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>{s.value}</p>
              <p style={{ color: MUTED, fontSize: '0.875rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 5%', background: '#111111', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none' }}>
          <p style={{ fontSize: 'clamp(5rem, 16vw, 16rem)', fontWeight: 900, color: 'rgba(255,255,255,0.03)', letterSpacing: '-0.03em', lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap' }}>LUXEWASH</p>
        </div>
        <div className="reveal" style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: '#f0efec', letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.1 }}>
            Ready to experience the<br /><em style={{ fontStyle: 'italic', color: G }}>LuxeWash difference?</em>
          </h2>
          <p style={{ color: '#888', marginBottom: '2rem', lineHeight: 1.75, maxWidth: '30rem', margin: '0 auto 2rem' }}>
            Join thousands of members who trust us with their vehicles.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/checkout/membership')}
              style={{ padding: '0.875rem 2rem', background: G, color: '#fff', fontWeight: 700, fontSize: '0.9375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: '0.01em' }}
              onMouseEnter={e => { e.currentTarget.style.background = G2; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = G; e.currentTarget.style.transform = 'translateY(0)' }}>
              View Memberships
            </button>
            <button onClick={() => navigate('/checkout/service')}
              style={{ padding: '0.875rem 2rem', background: 'transparent', color: '#f0efec', fontWeight: 600, fontSize: '0.9375rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent' }}>
              Book a Wash
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}