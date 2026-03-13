import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const values = [
  { icon: '✅', title: 'Quality', desc: 'We never cut corners on your vehicle. Every wash meets our premium standard.' },
  { icon: '🌿', title: 'Eco-Care', desc: 'Water-saving equipment and biodegradable products in every service.' },
  { icon: '⚡', title: 'Speed', desc: 'In and out in under 15 minutes — without sacrificing quality.' },
  { icon: '🤝', title: 'Trust', desc: 'Transparent pricing, no hidden fees. Ever.' },
  { icon: '💎', title: 'Premium', desc: 'Luxury-level results at an honest, accessible price.' },
]

const team = [
  {
    name: 'James L.',
    role: 'Founder & CEO',
    initial: 'J',
    exp: '8+ yrs',
    bio: 'James launched LuxeWash in 2018 with a single bay and an obsession for perfection. His vision — premium results at honest prices — remains the foundation of everything we do.',
    tags: ['Leadership', 'Strategy'],
  },
  {
    name: 'Maria K.',
    role: 'Operations Manager',
    initial: 'M',
    exp: '6 yrs',
    bio: 'Maria owns the day-to-day at our location — from scheduling and staffing to quality audits. If things run like clockwork, it\'s because Maria built the clock.',
    tags: ['Operations', 'Training'],
  },
  {
    name: 'Ryan T.',
    role: 'Head of Detailing',
    initial: 'R',
    exp: '12 yrs',
    bio: 'Ryan brings 12 years of professional detailing expertise to every vehicle. Hand-polish, interior restoration, ceramic coating — he has seen it all and perfected it all.',
    tags: ['Detailing', 'Ceramic Coat'],
  },
  {
    name: 'Sofia P.',
    role: 'Customer Experience Lead',
    initial: 'S',
    exp: '4 yrs',
    bio: 'Sofia ensures every customer leaves happier than they arrived. She oversees our loyalty programme, handles feedback, and makes sure no concern goes unanswered.',
    tags: ['Customer Care', 'Loyalty'],
  },
]

const stats = [
  { value: '5,000+', label: 'Happy Members' },
  { value: '8+', label: 'Years in Business' },
  { value: '1', label: 'Location' },
  { value: '99.99%', label: 'Satisfaction Rate' },
]

const cardBase = {
  background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
  borderRadius: '1rem',
  transition: 'all 0.25s ease',
}

const onCardEnter = (e) => {
  e.currentTarget.style.border = '1px solid rgba(59,130,246,0.35)'
  e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.12), 0 4px 24px rgba(0,0,0,0.4)'
  e.currentTarget.style.transform = 'translateY(-3px)'
}
const onCardLeave = (e) => {
  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)'
  e.currentTarget.style.transform = 'translateY(0)'
}

const btnBlue = { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 4px 20px rgba(59,130,246,0.35)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }
const onBtnEnter = (e) => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,130,246,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }
const onBtnLeave = (e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      {/* Page Header */}
      <section style={{ paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center', padding: '8rem 1.5rem 4rem' }}>
        <p style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Our Story</p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          About LuxeWash
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1.125rem', maxWidth: '30rem', margin: '0 auto' }}>
          More than a car wash — a commitment to quality.
        </p>
      </section>

      {/* Our Story */}
      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ ...cardBase, padding: '2rem', minHeight: '18rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '5rem' }}>🚗</span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>Our Story</h2>
            <p style={{ color: '#94A3B8', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>
              Founded in 2018, LuxeWash started as a single-bay operation with one simple belief — every car deserves a showroom finish. What began as a passion for detail grew into a full-service auto care destination trusted by thousands of members right here in the community.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: 1.75, fontSize: '0.9375rem' }}>
              Today, from our purpose-built facility, LuxeWash combines cutting-edge equipment with eco-friendly products to deliver a premium experience every single time. We focus on one location so we can focus entirely on you.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(180deg, #060e1a 0%, #0A1628 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>What We Stand For</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Our Values</h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem' }}>What we stand for, every single day.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {values.map(v => (
              <div key={v.title} style={{ ...cardBase, padding: '1.75rem' }} onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}>
                <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{v.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1.0625rem', marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>The People</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Meet the Team</h2>
            <p style={{ color: '#94A3B8' }}>The people behind every spotless vehicle.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {team.map(member => (
              <div key={member.name} style={{ ...cardBase, padding: '1.75rem', textAlign: 'center' }} onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}>
                {/* Avatar with exp badge */}
                <div style={{ position: 'relative', width: '5rem', margin: '0 auto 1.125rem' }}>
                  <div style={{ width: '5rem', height: '5rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.12)', border: '2px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontWeight: 700, fontSize: '1.5rem' }}>
                    {member.initial}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: '-4px', background: '#3B82F6', borderRadius: '9999px', padding: '2px 7px', fontSize: '0.625rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                    {member.exp}
                  </div>
                </div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.2rem' }}>{member.name}</h3>
                <p style={{ color: '#3B82F6', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.875rem' }}>{member.role}</p>
                <p style={{ color: '#94A3B8', fontSize: '0.8125rem', lineHeight: 1.65, marginBottom: '1rem', textAlign: 'left' }}>{member.bio}</p>
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                  {member.tags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93C5FD', fontSize: '0.6875rem', fontWeight: 500, padding: '3px 9px', borderRadius: '9999px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 1.5rem', background: 'linear-gradient(180deg, #060e1a 0%, #0A1628 100%)' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label} style={{ ...cardBase, padding: '1.75rem' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3B82F6', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{s.value}</p>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Ready to experience the LuxeWash difference?
        </h2>
        <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Join thousands of members who trust us with their vehicles.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => navigate('/checkout/membership')}
            style={{ ...btnBlue, padding: '0.875rem 2rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}>
            View Memberships
          </button>
          <button onClick={() => navigate('/checkout/service')}
            style={{ padding: '0.875rem 2rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent' }}>
            Book a Wash
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
