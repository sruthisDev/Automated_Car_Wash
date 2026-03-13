import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import Navbar from '../components/Navbar'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

const PLANS = [
  { id: 'standard', label: 'Standard', price: 29, includes: ['Unlimited Basic Washes', 'Priority booking', 'Member discounts'] },
  { id: 'premium', label: 'Premium', price: 49, includes: ['Unlimited Basic & Deluxe Washes', 'Interior vacuum included', 'Window cleaning', 'Priority booking'] },
  { id: 'premium_plus', label: 'Premium Plus', price: 79, includes: ['Unlimited All Washes', 'Priority lane access', 'Free monthly full detail', 'Dedicated support'] },
]

const BG    = '#f0efec'
const CARD  = '#ffffff'
const BDR   = 'rgba(0,0,0,0.09)'
const TEXT  = '#111111'
const MUTED = '#666666'
const G     = '#C8A96E'

const cardBase = { background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem' }

const inputBase = {
  width: '100%', background: BG, border: `1px solid rgba(0,0,0,0.05)`, borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem', color: MUTED, fontSize: '0.875rem', outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box', cursor: 'default',
}

const btnDark = { background: '#111111', border: 'none', cursor: 'pointer', transition: 'all 0.2s', color: '#f0efec', fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }
const onBtnEnter = (e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)' } }
const onBtnLeave = (e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.transform = 'translateY(0)' }

// ── Membership Form ────────────────────────────────────
function MembershipForm({ preselected }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const user = (() => { try { return JSON.parse(localStorage.getItem('lw_user')) } catch { return null } })()
  const token = localStorage.getItem('lw_token')

  const [plan, setPlan] = useState(preselected || 'premium')
  const [billing, setBilling] = useState('monthly')
  const [useNewCard, setUseNewCard] = useState(!user?.card_last4)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedPlan = PLANS.find(p => p.id === plan)
  const price = billing === 'annual'
    ? +(selectedPlan.price * 12 * 0.85).toFixed(2)
    : selectedPlan.price

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let paymentMethodId = null
      if (useNewCard || !user?.card_last4) {
        if (!stripe || !elements) { setError('Stripe not loaded'); setLoading(false); return }
        const cardElement = elements.getElement(CardElement)
        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card', card: cardElement,
          billing_details: { name: user.full_name, email: user.email },
        })
        if (stripeError) { setError(stripeError.message); setLoading(false); return }
        paymentMethodId = paymentMethod.id
      }
      const { data } = await axios.post(`/api/payments/membership?token=${token}`, { plan, payment_method_id: paymentMethodId })
      const stored = JSON.parse(localStorage.getItem('lw_user') || '{}')
      localStorage.setItem('lw_user', JSON.stringify({
        ...stored, membership_plan: plan, membership_status: 'active',
        card_last4: data.card_last4 || stored.card_last4,
        card_brand: data.card_brand || stored.card_brand,
      }))
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[{ label: 'Name', value: user?.full_name || '' }, { label: 'Email', value: user?.email || '' }].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.75rem', marginBottom: '0.375rem' }}>{f.label}</label>
                <input value={f.value} readOnly style={inputBase} />
              </div>
            ))}
          </div>
        </div>

        {/* Plan Selection */}
        <div style={{ ...cardBase, padding: '1.5rem' }}>
          {sectionTitle('Select Membership Plan')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {PLANS.map(p => (
              <button key={p.id} type="button" onClick={() => setPlan(p.id)}
                style={{
                  width: '100%', padding: '1rem', borderRadius: '0.5rem', textAlign: 'left',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', system-ui, sans-serif",
                  ...(plan === p.id
                    ? { background: 'rgba(200,169,110,0.07)', border: `1px solid rgba(200,169,110,0.5)` }
                    : { background: BG, border: `1px solid ${BDR}` }
                  ),
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: plan === p.id ? TEXT : MUTED }}>{p.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: plan === p.id ? G : TEXT }}>${p.price}/mo</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {p.includes.slice(0, 2).map(item => (
                    <span key={item} style={{ color: MUTED, fontSize: '0.8125rem' }}>✓ {item}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Billing Cycle */}
        <div style={{ ...cardBase, padding: '1.5rem' }}>
          {sectionTitle('Billing Cycle')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { id: 'monthly', label: 'Monthly', price: `$${selectedPlan.price}/mo`, badge: null },
              { id: 'annual', label: 'Annually', price: `$${+(selectedPlan.price * 12 * 0.85).toFixed(0)}/yr`, badge: 'Save 15%' },
            ].map(b => (
              <button key={b.id} type="button" onClick={() => setBilling(b.id)}
                style={{
                  padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', cursor: 'pointer',
                  fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s',
                  ...(billing === b.id
                    ? { background: 'rgba(200,169,110,0.07)', border: `1px solid rgba(200,169,110,0.5)` }
                    : { background: BG, border: `1px solid ${BDR}` }
                  ),
                }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: billing === b.id ? TEXT : MUTED, marginBottom: '0.25rem' }}>{b.label}</p>
                <p style={{ fontWeight: 700, fontSize: '1.125rem', color: billing === b.id ? G : TEXT }}>{b.price}</p>
                {b.badge && <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 500 }}>{b.badge}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Payment */}
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

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !stripe}
          style={{ ...btnDark, width: '100%', padding: '1rem', borderRadius: '0.875rem', fontSize: '1rem', opacity: (loading || !stripe) ? 0.6 : 1 }}
          onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}>
          {loading ? 'Processing...' : `Start Membership — $${price.toFixed(2)}${billing === 'annual' ? '/yr' : '/mo'}`}
        </button>
      </div>

      {/* Order Summary */}
      <div style={{ width: '17rem', flexShrink: 0 }}>
        <div style={{ ...cardBase, padding: '1.5rem', position: 'sticky', top: '6rem' }}>
          <h3 style={{ color: TEXT, fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: MUTED }}>Plan</span>
              <span style={{ color: TEXT }}>{selectedPlan?.label}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: MUTED }}>Billing</span>
              <span style={{ color: TEXT, textTransform: 'capitalize' }}>{billing}</span>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ color: MUTED, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Includes</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {selectedPlan?.includes.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: MUTED }}>
                  <svg width="14" height="14" fill="none" stroke={G} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ borderTop: `1px solid ${BDR}`, paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ color: TEXT }}>Total</span>
              <span style={{ color: G, fontSize: '1.125rem' }}>${price.toFixed(2)}{billing === 'annual' ? '/yr' : '/mo'}</span>
            </div>
            <p style={{ color: MUTED, fontSize: '0.75rem', marginTop: '0.5rem' }}>Renews automatically. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </form>
  )
}

// ── Page ───────────────────────────────────────────────
export default function MembershipCheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const preselected = location.state?.preselected || 'premium'
  const token = localStorage.getItem('lw_token')

  if (!token) {
    return (
      <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1.5rem' }}>
          <div style={{ maxWidth: '26rem', width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: '0.875rem', padding: '2.5rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '2.75rem', display: 'block', marginBottom: '1rem' }}>💎</span>
            <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sign in to get a membership</h2>
            <p style={{ color: MUTED, fontSize: '0.875rem', marginBottom: '1.75rem' }}>You need an account to purchase a membership plan.</p>
            <button onClick={() => navigate('/login', { state: { redirectTo: '/checkout/membership' } })}
              style={{ background: '#111111', border: 'none', cursor: 'pointer', width: '100%', padding: '0.875rem', borderRadius: '0.5rem', fontSize: '0.9375rem', fontWeight: 700, color: '#f0efec', fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#111111'}>
              Login / Sign Up
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checker-bg" style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <Navbar />
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: TEXT, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Choose Your Membership</h1>
        <Elements stripe={stripePromise}>
          <MembershipForm preselected={preselected} />
        </Elements>
      </div>
    </div>
  )
}