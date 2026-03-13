import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import Navbar from '../components/Navbar'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

const PLANS = [
  {
    id: 'standard', label: 'Standard', price: 29,
    includes: ['Unlimited Basic Washes', 'Priority booking', 'Member discounts'],
  },
  {
    id: 'premium', label: 'Premium', price: 49,
    includes: ['Unlimited Basic & Deluxe Washes', 'Interior vacuum included', 'Window cleaning', 'Priority booking'],
  },
  {
    id: 'premium_plus', label: 'Premium Plus', price: 79,
    includes: ['Unlimited All Washes', 'Priority lane access', 'Free monthly full detail', 'Dedicated support'],
  },
]

// ── Shared styles ──────────────────────────────────────
const cardBase = {
  background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
  borderRadius: '1rem',
}

const inputBase = {
  width: '100%',
  background: 'rgba(6,14,26,0.8)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '0.75rem',
  padding: '0.625rem 0.875rem',
  color: '#94A3B8',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: 'border-box',
  cursor: 'default',
}

const btnBlue = {
  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: '#fff',
  fontWeight: 600,
  fontFamily: "'Inter', system-ui, sans-serif",
}
const onBtnEnter = (e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,130,246,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' } }
const onBtnLeave = (e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }

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
          type: 'card',
          card: cardElement,
          billing_details: { name: user.full_name, email: user.email },
        })
        if (stripeError) { setError(stripeError.message); setLoading(false); return }
        paymentMethodId = paymentMethod.id
      }
      // paymentMethodId = null means backend uses saved card on file
      const { data } = await axios.post(`/api/payments/membership?token=${token}`, {
        plan,
        payment_method_id: paymentMethodId,
      })
      // Update localStorage so checkout pages see the new plan immediately
      const stored = JSON.parse(localStorage.getItem('lw_user') || '{}')
      localStorage.setItem('lw_user', JSON.stringify({
        ...stored,
        membership_plan: plan,
        membership_status: 'active',
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
    <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>{title}</h3>
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
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '0.375rem' }}>{f.label}</label>
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
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  ...(plan === p.id
                    ? { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.4)' }
                    : { background: 'rgba(6,14,26,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                  ),
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: plan === p.id ? '#fff' : '#94A3B8' }}>{p.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: plan === p.id ? '#60a5fa' : '#fff' }}>${p.price}/mo</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {p.includes.slice(0, 2).map(item => (
                    <span key={item} style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>✓ {item}</span>
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
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: 'all 0.2s',
                  ...(billing === b.id
                    ? { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.4)' }
                    : { background: 'rgba(6,14,26,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                  ),
                }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: billing === b.id ? '#fff' : '#94A3B8', marginBottom: '0.25rem' }}>{b.label}</p>
                <p style={{ fontWeight: 700, fontSize: '1.125rem', color: billing === b.id ? '#60a5fa' : '#fff' }}>{b.price}</p>
                {b.badge && <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 500 }}>{b.badge}</span>}
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
                    borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
                    ...(opt.checked ? { border: '1px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.08)' } : { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(6,14,26,0.4)' }),
                  }}>
                  <input type="radio" checked={opt.checked} onChange={opt.onChange} style={{ accentColor: '#3B82F6' }} />
                  <span>
                    <span style={{ color: '#fff', fontSize: '0.875rem' }}>{opt.label}</span>
                    {opt.sub && <span style={{ color: '#94A3B8', fontSize: '0.8125rem', marginLeft: '0.5rem' }}>{opt.sub}</span>}
                  </span>
                </label>
              ))}
            </div>
          )}
          {(useNewCard || !user?.card_last4) && (
            <div style={{ padding: '1rem', background: 'rgba(6,14,26,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}>
              <CardElement options={{ style: { base: { color: '#fff', fontSize: '14px', fontFamily: "'Inter', system-ui, sans-serif", '::placeholder': { color: '#4B5563' }, iconColor: '#3B82F6' }, invalid: { color: '#F87171' } } }} />
            </div>
          )}
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !stripe}
          style={{ ...btnBlue, width: '100%', padding: '1rem', borderRadius: '0.875rem', fontSize: '1rem', opacity: (loading || !stripe) ? 0.6 : 1 }}
          onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}>
          {loading ? 'Processing...' : `Start Membership — $${price.toFixed(2)}${billing === 'annual' ? '/yr' : '/mo'}`}
        </button>
      </div>

      {/* Order Summary */}
      <div style={{ width: '17rem', flexShrink: 0 }}>
        <div style={{ ...cardBase, padding: '1.5rem', position: 'sticky', top: '6rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#94A3B8' }}>Plan</span>
              <span style={{ color: '#fff' }}>{selectedPlan?.label}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#94A3B8' }}>Billing</span>
              <span style={{ color: '#fff', textTransform: 'capitalize' }}>{billing}</span>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Includes</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {selectedPlan?.includes.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                  <svg width="14" height="14" fill="none" stroke="#3B82F6" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ color: '#fff' }}>Total</span>
              <span style={{ color: '#60a5fa', fontSize: '1.125rem' }}>${price.toFixed(2)}{billing === 'annual' ? '/yr' : '/mo'}</span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.5rem' }}>Renews automatically. Cancel anytime.</p>
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
      <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1.5rem' }}>
          <div style={{ maxWidth: '26rem', width: '100%', background: 'linear-gradient(145deg, #0F2040 0%, #0d1b33 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2.75rem', display: 'block', marginBottom: '1rem' }}>💎</span>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sign in to get a membership</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.75rem' }}>You need an account to purchase a membership plan.</p>
            <button onClick={() => navigate('/login', { state: { redirectTo: '/checkout/membership' } })}
              style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 4px 20px rgba(59,130,246,0.35)', border: 'none', cursor: 'pointer', width: '100%', padding: '0.875rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
              Login / Sign Up
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '2rem' }}>Choose Your Membership</h1>
        <Elements stripe={stripePromise}>
          <MembershipForm preselected={preselected} />
        </Elements>
      </div>
    </div>
  )
}
