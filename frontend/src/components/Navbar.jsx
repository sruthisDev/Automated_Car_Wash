import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('lw_user')) } catch { return null }
  })()

  const isLanding = location.pathname === '/'

  const handleHome = () => {
    setMenuOpen(false)
    if (isLanding) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const handleNavLink = (sectionId) => {
    setMenuOpen(false)
    if (isLanding) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: sectionId } })
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('lw_token')
    localStorage.removeItem('lw_user')
    setDropdownOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f0efec]/90 backdrop-blur-sm border-b border-black/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C8A96E] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">LW</span>
          </div>
          <span className="text-[#111111] font-bold text-xl tracking-tight">LuxeWash</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={handleHome} className="text-[#666] hover:text-[#111] transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">
            Home
          </button>
          <button onClick={() => handleNavLink('services')} className="text-[#666] hover:text-[#111] transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">
            Services
          </button>
          <button onClick={() => handleNavLink('memberships')} className="text-[#666] hover:text-[#111] transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">
            Memberships
          </button>
          <Link to="/about"   className="text-[#666] hover:text-[#111] transition-colors text-sm font-medium">About</Link>
          <Link to="/contact" className="text-[#666] hover:text-[#111] transition-colors text-sm font-medium">Contact</Link>
        </div>

        {/* Auth Area */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center hover:border-[#C8A96E] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-[#666]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-black/[0.08] rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-black/[0.07]">
                    <p className="text-[#111] text-sm font-medium truncate">{user.full_name}</p>
                    <p className="text-[#888] text-xs truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-sm text-[#666] hover:text-[#111] hover:bg-black/[0.03] transition-colors">
                    Profile
                  </Link>
                  <Link to="/dashboard?tab=appointments" onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-sm text-[#666] hover:text-[#111] hover:bg-black/[0.03] transition-colors">
                    Appointments
                  </Link>
                  <div className="border-t border-black/[0.07]">
                    <button onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-black/[0.03] transition-colors cursor-pointer">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"
              className="px-5 py-2 bg-[#111111] hover:bg-[#333] text-white text-sm font-bold rounded-lg transition-colors">
              Login / Sign Up
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-[#666] hover:text-[#111] cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#f0efec] border-t border-black/[0.08] px-6 py-4 flex flex-col gap-4">
          <button onClick={handleHome} className="text-left text-[#666] hover:text-[#111] text-sm bg-transparent border-none cursor-pointer">Home</button>
          <button onClick={() => handleNavLink('services')} className="text-left text-[#666] hover:text-[#111] text-sm bg-transparent border-none cursor-pointer">Services</button>
          <button onClick={() => handleNavLink('memberships')} className="text-left text-[#666] hover:text-[#111] text-sm bg-transparent border-none cursor-pointer">Memberships</button>
          <Link to="/about"   onClick={() => setMenuOpen(false)} className="text-[#666] hover:text-[#111] text-sm">About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-[#666] hover:text-[#111] text-sm">Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-[#666] hover:text-[#111] text-sm">Dashboard</Link>
              <button onClick={handleSignOut} className="text-left text-red-500 text-sm bg-transparent border-none cursor-pointer">Sign Out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-[#111111] text-white text-sm font-bold rounded-lg text-center">Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  )
}