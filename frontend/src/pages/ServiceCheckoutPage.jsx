import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import Navbar from '../components/Navbar'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

const SERVICES = [
  { id: 'basic', label: 'Basic Wash', price: 12 },
  { id: 'deluxe', label: 'Deluxe Wash', price: 22 },
  { id: 'premium', label: 'Premium Wash', price: 35 },
]

const MEMBERSHIP_COVERAGE = {
  standard:     ['basic'],
  premium:      ['basic', 'deluxe'],
  premium_plus: ['basic', 'deluxe', 'premium'],
}

const MEMBERSHIP_DISCOUNTS = {
  standard:     0.10,
  premium:      0.20,
  premium_plus: 0.00,
}

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '3:30 PM', '4:30 PM', '5:00 PM',
]

const TAX_RATE = 0.09

const BG    = '#f0efec'
const CARD  = '#ffffff'
const BDR   = 'rgba(0,0,0,0.09)'
const TEXT  = '#111111'
const MUTED = '#666666'
const G     = '#C8A96E'

const cardBase = { background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem' }

const inputBase = {
  width: '100%', background: BG, border: `1px solid ${BDR}`, borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem', color: TEXT, fontSize: '0.875rem', outline: 'none',
  transition: 'border-color 0.2s', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box',
}
const onInputFocus = (e) => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.6)' }
const onInputBlur  = (e) => { e.currentTarget.style.borderColor = BDR }

const btnDark = { background: '#111111', border: 'none', cursor: 'pointer', transition: 'all 0.2s', color: '#f0efec', fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }
const onBtnEnter = (e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)' } }
const onBtnLeave = (e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.transform = 'translateY(0)' }

function CheckoutForm({ preselected }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const user = (() => { try { return JSON.parse(localStorage.getItem('lw_user')) } catch { return null } })()
  const token = localStorage.getItem('lw_token')

  const [service, setService] = useState(preselected || 'basic')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const isGuest = !user
  const [useNewCard, setUseNewCard] = useState(!user?.card_last4)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [memberPlan, setMemberPlan] = useState(user?.membership_plan || null)
  const [memberStatus, setMemberStatus] = useState(user?.membership_status || null)

  useEffect(() => {
    if (!token) return
    axios.get(`/api/auth/me?token=${token}`).then(({ data }) => {
      const plan   = data.membership?.plan   || null
      const status = data.membership?.status || null
      setMemberPlan(plan)
      setMemberStatus(status)
      const stored = JSON.parse(localStorage.getItem('lw_user') || '{}')
      localStorage.setItem('lw_user', JSON.stringify({ ...stored, membership_plan: plan, membership_status: status }))
    }).catch(() => {})
  }, [token])

  const selectedService = SERVICES.find(s => s.id === service)

  const memberActive        = !isGuest && memberStatus === 'active'
  const coveredByMembership = memberActive && MEMBERSHIP_COVERAGE[memberPlan]?.includes(service)
  const discountPct         = memberActive && !coveredByMembership ? (MEMBERSHIP_DISCOUNTS[memberPlan] || 0) : 0

  const basePrice = selectedService?.price || 0
  const price     = coveredByMembership ? 0 : +(basePrice * (1 - discountPct)).toFixed(2)
  const tax       = coveredByMembership ? 0 : +(price * TAX_RATE).toFixed(2)
  const total     = coveredByMembership ? 0 : +(price + tax).toFixed(2)
  const today     = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!date || !timeSlot) { setError('Please select a date and time slot'); return }
    if (isGuest && (!guestName || !guestEmail)) { setError('Please enter your name and email'); return }
    setLoading(true)
    try {
      let paymentMethodId = null
      if (!coveredByMembership) {
        if (useNewCard || !user?.card_last4) {
          if (!stripe || !elements) { setError('Stripe not loaded'); setLoading(false); return }
          const cardElement = elements.getElement(CardElement)
          const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card', card: cardElement,
            billing_details: { name: user?.full_name || guestName, email: user?.email || guestEmail },
          })
          if (stripeError) { setError(stripeError.message); setLoading(false); return }
          paymentMethodId = paymentMethod.id
        }
      }
      const params = token ? `?token=${token}` : ''
      const { data } = await axios.post(`/api/payments/service${params}`, {
        service, appointment_date: date, appointment_time: timeSlot,
        guest_name: isGuest ? guestName : null,
        guest_email: isGuest ? guestEmail : null,
        payment_method_id: paymentMethodId,
      })
      navigate('/payment/success', { state: { result: data } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sectionTitle = (title) => (
    <h3 style={{ color: TEXT, fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>{title}</h3>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Customer Info */}
        <div style={{ ...cardBase, padding: '1.5rem' }}>
          {sectionTitle('Customer Info')}
          {user ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[{ label: 'Name', value: user.full_name }, { label: 'Email', value: user.email }].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.75rem', marginBottom: '0.375rem' }}>{f.label}</label>
                  <input value={f.value} readOnly style={{ ...inputBase, border: `1px solid rgba(0,0,0,0.05)`, color: MUTED, cursor: 'default' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.75rem', marginBottom: '0.375rem' }}>Full Name</label>
                <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe" style={inputBase} onFocus={onInputFocus} onBlur={onInputBlur} />
              </div>
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.75rem', marginBottom: '0.375rem' }}>Email Address</label>
                <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="john@email.com" style={inputBase} onFocus={onInputFocus} onBlur={onInputBlur} />
              </div>
            </div>
          )}
        </div>

        {/* Service */}
        <div style={{ ...cardBase, padding: '1.5rem' }}>
          {sectionTitle('Select Service')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {SERVICES.map(s => {
              const isCovered  = memberActive && MEMBERSHIP_COVERAGE[memberPlan]?.includes(s.id)
              const sDiscount  = memberActive && !isCovered ? (MEMBERSHIP_DISCOUNTS[memberPlan] || 0) : 0
              const isSelected = service === s.id
              const discountedPrice = isCovered ? 0 : +(s.price * (1 - sDiscount)).toFixed(2)
              return (
                <button key={s.id} type="button" onClick={() => setService(s.id)}
                  style={{
                    padding: '1rem', borderRadius: '0.5rem', textAlign: 'left', cursor: 'pointer',
                    transition: 'all 0.2s', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative',
                    ...(isSelected
                      ? { background: 'rgba(200,169,110,0.07)', border: `1px solid rgba(200,169,110,0.5)` }
                      : { background: BG, border: `1px solid ${BDR}` }
                    ),
                  }}>
                  {isCovered && (
                    <span style={{ display: 'inline-block', marginBottom: '0.375rem', fontSize: '0.6875rem', fontWeight: 600, color: '#16a34a', background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '9999px', padding: '0.1rem 0.5rem' }}>
                      ✓ Covered
                    </span>
                  )}
                  {!isCovered && sDiscount > 0 && (
                    <span style={{ display: 'inline-block', marginBottom: '0.375rem', fontSize: '0.6875rem', fontWeight: 600, color: '#b45309', background: 'rgba(180,83,9,0.07)', border: '1px solid rgba(180,83,9,0.2)', borderRadius: '9999px', padding: '0.1rem 0.5rem' }}>
                      {Math.round(sDiscount * 100)}% discount
                    </span>
                  )}
                  <p style={{ fontWeight: 500, fontSize: '0.875rem', color: isSelected ? TEXT : MUTED, marginBottom: '0.25rem' }}>{s.label}</p>
                  {isCovered ? (
                    <p style={{ fontWeight: 700, fontSize: '1.125rem', color: '#16a34a' }}>Free</p>
                  ) : sDiscount > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.125rem', color: isSelected ? G : TEXT }}>${discountedPrice}</p>
                      <p style={{ fontSize: '0.75rem', color: '#aaa', textDecoration: 'line-through' }}>${s.price}</p>
                    </div>
                  ) : (
                    <p style={{ fontWeight: 700, fontSize: '1.125rem', color: isSelected ? G : TEXT }}>${s.price}</p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Date */}
        <div style={{ ...cardBase, padding: '1.5rem' }}>
          {sectionTitle('Select Date')}
          <input type="date" value={date} min={today} onChange={e => { setDate(e.target.value); setTimeSlot('') }}
            style={{ ...inputBase, colorScheme: 'light' }}
            onFocus={onInputFocus} onBlur={onInputBlur} />
        </div>

        {/* Time Slots — only shown after a date is selected */}
        {date && (
          <div style={{ ...cardBase, padding: '1.5rem' }}>
            {sectionTitle('Select Time Slot')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {TIME_SLOTS.map(t => (
                <button key={t} type="button" onClick={() => setTimeSlot(t)}
                  style={{
                    padding: '0.5rem 0.25rem', borderRadius: '0.375rem', fontSize: '0.8125rem',
                    fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s',
                    ...(timeSlot === t
                      ? { background: '#111111', color: '#f0efec', border: 'none' }
                      : { background: BG, color: MUTED, border: `1px solid ${BDR}` }
                    ),
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Membership coverage banner */}
        {coveredByMembership && (
          <div style={{ padding: '1rem 1.25rem', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '1.125rem' }}>✅</span>
            <p style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 500 }}>
              This service is covered by your membership — no payment needed.
            </p>
          </div>
        )}

        {/* Payment */}
        {!coveredByMembership && (
          <div style={{ ...cardBase, padding: '1.5rem' }}>
            {sectionTitle('Payment')}
            {user?.card_last4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                  { id: 'saved', checked: !useNewCard, onChange: () => setUseNewCard(false), label: `${user.card_brand?.toUpperCase()} •••• ${user.card_last4}`, sub: `Expires ${user.card_expiry}` },
                  { id: 'new', checked: useNewCard, onChange: () => setUseNewCard(true), label: 'Use a different card' },
                ].map(opt => (
                  <label key={opt.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem',
                      borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s',
                      ...(opt.checked
                        ? { border: `1px solid rgba(200,169,110,0.5)`, background: 'rgba(200,169,110,0.05)' }
                        : { border: `1px solid ${BDR}`, background: BG }
                      ),
                    }}>
                    <input type="radio" checked={opt.checked} onChange={opt.onChange} style={{ accentColor: G }} />
                    <span>
                      <span style={{ color: TEXT, fontSize: '0.875rem' }}>{opt.label}</span>
                      {opt.sub && <span style={{ color: MUTED, fontSize: '0.8125rem', marginLeft: '0.5rem' }}>{opt.sub}</span>}
                    </span>
                  </label>
                ))}
              </div>
            )}
            {(useNewCard || !user?.card_last4) && (
              <div style={{ padding: '1rem', background: BG, border: `1px solid ${BDR}`, borderRadius: '0.5rem' }}>
                <CardElement options={{ style: { base: { color: TEXT, fontSize: '14px', fontFamily: "'Inter', system-ui, sans-serif", '::placeholder': { color: '#aaa' }, iconColor: G }, invalid: { color: '#dc2626' } } }} />
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !stripe}
          style={{ ...btnDark, width: '100%', padding: '1rem', borderRadius: '0.875rem', fontSize: '1rem', opacity: (loading || !stripe) ? 0.6 : 1 }}
          onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}>
          {loading ? 'Processing...' : coveredByMembership ? 'Book for Free' : `Confirm & Pay $${total.toFixed(2)}`}
        </button>
      </div>

      {/* Order Summary */}
      <div style={{ width: '17rem', flexShrink: 0 }}>
        <div style={{ ...cardBase, padding: '1.5rem', position: 'sticky', top: '6rem' }}>
          <h3 style={{ color: TEXT, fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: MUTED }}>Service</span>
              <span style={{ color: TEXT }}>{selectedService?.label}</span>
            </div>
            {date && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: MUTED }}>Date</span>
                <span style={{ color: TEXT }}>{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            {timeSlot && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: MUTED }}>Time</span>
                <span style={{ color: TEXT }}>{timeSlot}</span>
              </div>
            )}
          </div>
          <div style={{ borderTop: `1px solid ${BDR}`, paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: MUTED }}>Subtotal</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                {discountPct > 0 && <span style={{ color: '#aaa', fontSize: '0.75rem', textDecoration: 'line-through' }}>${basePrice.toFixed(2)}</span>}
                <span style={{ color: TEXT }}>{coveredByMembership ? 'Free' : `$${price.toFixed(2)}`}</span>
              </div>
            </div>
            {discountPct > 0 && !coveredByMembership && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#b45309' }}>Member discount ({Math.round(discountPct * 100)}%)</span>
                <span style={{ color: '#b45309' }}>-${(basePrice * discountPct).toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: MUTED }}>Tax (9%)</span>
              <span style={{ color: TEXT }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '0.625rem', borderTop: `1px solid ${BDR}` }}>
              <span style={{ color: TEXT }}>Total</span>
              <span style={{ color: coveredByMembership ? '#16a34a' : G, fontSize: '1.125rem' }}>
                {coveredByMembership ? 'Free' : `$${total.toFixed(2)}`}
              </span>
            </div>
            {coveredByMembership && <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.375rem' }}>✓ Covered by your membership</p>}
          </div>
        </div>
      </div>
    </form>
  )
}

export default function ServiceCheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const preselected = location.state?.preselected || 'basic'
  const [proceedAs, setProceedAs] = useState(null)
  const user = (() => { try { return JSON.parse(localStorage.getItem('lw_user')) } catch { return null } })()

  useEffect(() => { if (user) setProceedAs('user') }, [])

  return (
    <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <Navbar />
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: TEXT, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Book Your Service</h1>

        {!user && !proceedAs && (
          <div style={{ maxWidth: '26rem', margin: '0 auto' }}>
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', padding: '2.5rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '9999px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>
                🚗
              </div>
              <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>How would you like to proceed?</h2>
              <p style={{ color: MUTED, fontSize: '0.875rem', marginBottom: '1.75rem' }}>Sign in to save booking history and use saved payment details.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => navigate('/login', { state: { redirectTo: '/checkout/service' } })}
                  style={{ background: '#111111', border: 'none', cursor: 'pointer', padding: '0.875rem', borderRadius: '0.5rem', fontSize: '0.9375rem', fontWeight: 700, color: '#f0efec', fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#333'}
                  onMouseLeave={e => e.currentTarget.style.background = '#111111'}>
                  Login / Sign Up
                </button>
                <button onClick={() => setProceedAs('guest')}
                  style={{ padding: '0.875rem', borderRadius: '0.5rem', fontSize: '0.9375rem', fontWeight: 600, color: TEXT, background: 'transparent', border: `1px solid ${BDR}`, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = BDR }}>
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        )}

        {(user || proceedAs === 'guest') && (
          <Elements stripe={stripePromise}>
            <CheckoutForm preselected={preselected} />
          </Elements>
        )}
      </div>
    </div>
  )
}