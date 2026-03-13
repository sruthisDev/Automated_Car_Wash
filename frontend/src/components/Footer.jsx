import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const scrollTo = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return (
    <footer style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '3rem', paddingBottom: '1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 5%' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{ width: '2rem', height: '2rem', background: '#C8A96E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>LW</span>
              </div>
              <span style={{ color: '#f0efec', fontWeight: 700, fontSize: '1.125rem' }}>LuxeWash</span>
            </div>
            <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Premium auto care for every vehicle. Fast, clean, and trusted since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#f0efec', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Home',        action: handleHome },
                { label: 'Services',    action: () => scrollTo('services') },
                { label: 'Memberships', action: () => scrollTo('memberships') },
              ].map(item => (
                <li key={item.label}>
                  <button onClick={item.action} style={{ color: '#666', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f0efec'}
                    onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                    {item.label}
                  </button>
                </li>
              ))}
              {[
                { label: 'About',   to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} style={{ color: '#666', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f0efec'}
                    onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#f0efec', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '📍', text: '123 Shine Ave, Suite 100\nCity, State 00000', multi: true },
                { icon: '📞', text: '+1 (555) 123-4567' },
                { icon: '📧', text: 'hello@luxewash.com' },
                { icon: '🕐', text: 'Mon–Sat: 8am–7pm | Sun: 9am–5pm' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                  <span style={{ fontSize: '0.875rem', marginTop: '0.1rem', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ lineHeight: 1.6, whiteSpace: item.multi ? 'pre-line' : 'normal' }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ color: '#f0efec', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {[
                { label: 'FB', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { label: 'IG', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'X',  path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              ].map(s => (
                <a key={s.label} href="#"
                  style={{ width: '2.25rem', height: '2.25rem', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8A96E'; e.currentTarget.style.background = 'rgba(200,169,110,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#1a1a1a' }}>
                  <svg style={{ width: '0.875rem', height: '0.875rem', color: '#666', fill: 'currentColor' }} viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <p style={{ color: '#444', fontSize: '0.875rem' }}>© 2026 LuxeWash. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map(label => (
              <a key={label} href="#" style={{ color: '#444', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#888'}
                onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}