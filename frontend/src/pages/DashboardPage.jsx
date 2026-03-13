import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Navbar from '../components/Navbar'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

const PLAN_LABELS = { standard: 'Standard', premium: 'Premium', premium_plus: 'Premium Plus' }
const SERVICE_LABELS = { basic: 'Basic Wash', deluxe: 'Deluxe Wash', premium: 'Premium Wash' }

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
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem',
  padding: '0.625rem 0.875rem',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: 'border-box',
}

const inputReadOnly = {
  ...inputBase,
  border: '1px solid rgba(255,255,255,0.05)',
  color: '#94A3B8',
  cursor: 'default',
}

const onInputFocus = (e) => { if (!e.currentTarget.readOnly) e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)' }
const onInputBlur = (e) => { if (!e.currentTarget.readOnly) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }

const btnBlue = {
  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: '#fff',
  fontWeight: 600,
  fontFamily: "'Inter', system-ui, sans-serif",
}
const onBtnEnter = (e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,130,246,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' } }
const onBtnLeave = (e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }

// ── Field component ────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder, readOnly }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.375rem' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        style={readOnly ? inputReadOnly : inputBase}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
    </div>
  )
}

// ── Payment Details Card (with Stripe update) ──────────
function PaymentDetailsCard({ profile, token, onProfileUpdate }) {
  const stripe = useStripe()
  const elements = useElements()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!stripe || !elements) return
    setError('')
    setSaving(true)
    try {
      const cardElement = elements.getElement(CardElement)
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name: profile?.full_name, email: profile?.email },
      })
      if (stripeError) { setError(stripeError.message); setSaving(false); return }

      const { data } = await axios.put(`/api/payments/update-card?token=${token}`, {
        payment_method_id: paymentMethod.id,
      })
      onProfileUpdate({ ...profile, card_last4: data.card_last4, card_brand: data.card_brand, card_expiry: data.card_expiry })
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('lw_user') || '{}')
      localStorage.setItem('lw_user', JSON.stringify({ ...stored, card_last4: data.card_last4, card_brand: data.card_brand, card_expiry: data.card_expiry }))
      setSuccess(true)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update card')
    }
    setSaving(false)
  }

  return (
    <div style={{ ...cardBase, padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>Payment Details</h3>
        {!editing
          ? <button onClick={() => { setEditing(true); setSuccess(false) }}
              style={{ color: '#3B82F6', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>
              {profile?.card_last4 ? 'Update Card' : 'Add Card'}
            </button>
          : <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => { setEditing(false); setError('') }}
                style={{ color: '#94A3B8', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                style={{ color: '#3B82F6', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
        }
      </div>

      {success && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.75rem', color: '#4ade80', fontSize: '0.875rem' }}>
          ✅ Card updated successfully
        </div>
      )}
      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {!editing && profile?.card_last4 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3.5rem', height: '2.25rem', background: 'rgba(6,14,26,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '0.6875rem', fontWeight: 700 }}>{profile.card_brand?.toUpperCase() || 'CARD'}</span>
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>•••• •••• •••• {profile.card_last4}</p>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Expires {profile.card_expiry}</p>
          </div>
        </div>
      )}

      {!editing && !profile?.card_last4 && (
        <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No payment method saved. Click &quot;Add Card&quot; to add one.</p>
      )}

      {editing && (
        <div style={{ padding: '1rem', background: 'rgba(6,14,26,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}>
          <CardElement options={{ style: { base: { color: '#fff', fontSize: '14px', fontFamily: "'Inter', system-ui, sans-serif", '::placeholder': { color: '#4B5563' }, iconColor: '#3B82F6' }, invalid: { color: '#F87171' } } }} />
        </div>
      )}
    </div>
  )
}

// ── Profile Tab ────────────────────────────────────────
function ProfileTab({ profile, token, onProfileUpdate }) {
  const navigate = useNavigate()
  const [nameEdit, setNameEdit] = useState(false)
  const [nameVal, setNameVal] = useState(profile?.full_name || '')
  const [nameSaving, setNameSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [cancellingMem, setCancellingMem] = useState(false)

  const saveName = async () => {
    if (!nameVal.trim()) return
    setNameSaving(true)
    try {
      await axios.put(`/api/dashboard/profile/name?token=${token}`, { full_name: nameVal })
      onProfileUpdate({ ...profile, full_name: nameVal })
      const stored = JSON.parse(localStorage.getItem('lw_user') || '{}')
      localStorage.setItem('lw_user', JSON.stringify({ ...stored, full_name: nameVal }))
      setNameEdit(false)
    } catch { /* ignore */ }
    setNameSaving(false)
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)
    if (pwForm.new_password !== pwForm.confirm) { setPwError('Passwords do not match'); return }
    if (pwForm.new_password.length < 8) { setPwError('Min. 8 characters'); return }
    setPwSaving(true)
    try {
      await axios.put(`/api/dashboard/profile/password?token=${token}`, {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      })
      setPwSuccess(true)
      setPwForm({ current_password: '', new_password: '', confirm: '' })
    } catch (err) {
      setPwError(err.response?.data?.detail || 'Failed to update password')
    }
    setPwSaving(false)
  }

  const cancelMembership = async () => {
    if (!window.confirm('Are you sure you want to cancel your membership?')) return
    setCancellingMem(true)
    try {
      await axios.put(`/api/dashboard/membership/cancel?token=${token}`)
      onProfileUpdate({ ...profile, membership: { ...profile.membership, status: 'cancelled' } })
    } catch { /* ignore */ }
    setCancellingMem(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Personal Info */}
      <div style={{ ...cardBase, padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>Personal Info</h3>
          {!nameEdit
            ? <button onClick={() => setNameEdit(true)} style={{ color: '#3B82F6', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>Edit</button>
            : <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setNameEdit(false)} style={{ color: '#94A3B8', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>Cancel</button>
                <button onClick={saveName} disabled={nameSaving} style={{ color: '#3B82F6', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", opacity: nameSaving ? 0.6 : 1 }}>
                  {nameSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
          }
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Field label="Full Name" value={nameEdit ? nameVal : (profile?.full_name || '')} onChange={(e) => setNameVal(e.target.value)} readOnly={!nameEdit} />
          <Field label="Email Address" value={profile?.email || ''} readOnly />
          <Field label="Member Since" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''} readOnly />
        </div>
      </div>

      {/* Change Password */}
      <div style={{ ...cardBase, padding: '1.5rem' }}>
        <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Change Password</h3>
        {pwSuccess && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.75rem', color: '#4ade80', fontSize: '0.875rem' }}>
            ✅ Password updated successfully
          </div>
        )}
        {pwError && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem' }}>
            {pwError}
          </div>
        )}
        <form onSubmit={savePassword}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <Field label="Current Password" type="password" value={pwForm.current_password} onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })} placeholder="••••••••" />
            <Field label="New Password" type="password" value={pwForm.new_password} onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} placeholder="Min. 8 characters" />
            <Field label="Confirm Password" type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="••••••••" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={pwSaving}
              style={{ ...btnBlue, padding: '0.625rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', opacity: pwSaving ? 0.6 : 1 }}
              onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}>
              {pwSaving ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Membership */}
      <div style={{ ...cardBase, padding: '1.5rem' }}>
        <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Membership</h3>
        {profile?.membership ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Plan', value: PLAN_LABELS[profile.membership.plan] || profile.membership.plan, valueStyle: { color: '#fff', fontWeight: 500 } },
                { label: 'Status', value: null, badge: profile.membership.status },
                { label: 'Renews On', value: profile.membership.renews_at || '—', valueStyle: { color: '#fff' } },
                { label: 'Price', value: `$${profile.membership.price}/month`, valueStyle: { color: '#fff' } },
              ].map((item, i) => (
                <div key={i}>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{item.label}</p>
                  {item.badge ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: item.badge === 'active' ? '#4ade80' : '#f87171' }}>
                      <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '9999px', background: item.badge === 'active' ? '#4ade80' : '#f87171', display: 'inline-block' }} />
                      {item.badge === 'active' ? 'Active' : 'Cancelled'}
                    </span>
                  ) : (
                    <p style={item.valueStyle}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
            {profile.membership.status === 'active' && (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/checkout/membership')}
                  style={{ ...btnBlue, padding: '0.5625rem 1.25rem', borderRadius: '0.625rem', fontSize: '0.875rem' }}
                  onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}>
                  Upgrade Plan
                </button>
                <button onClick={cancelMembership} disabled={cancellingMem}
                  style={{ padding: '0.5625rem 1.25rem', borderRadius: '0.625rem', fontSize: '0.875rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', system-ui, sans-serif", opacity: cancellingMem ? 0.6 : 1 }}>
                  {cancellingMem ? 'Cancelling...' : 'Cancel Plan'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No active membership</p>
            <button onClick={() => navigate('/checkout/membership')}
              style={{ ...btnBlue, padding: '0.5625rem 1.25rem', borderRadius: '0.625rem', fontSize: '0.875rem' }}
              onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}>
              Get a Membership
            </button>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <Elements stripe={stripePromise}>
        <PaymentDetailsCard profile={profile} token={token} onProfileUpdate={onProfileUpdate} />
      </Elements>

    </div>
  )
}

// ── Appointments Tab ───────────────────────────────────
function AppointmentsTab({ token }) {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    axios.get(`/api/dashboard/appointments?token=${token}`)
      .then(({ data }) => setAppointments(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    setCancelling(id)
    try {
      await axios.put(`/api/dashboard/appointments/${id}/cancel?token=${token}`)
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch { /* ignore */ }
    setCancelling(null)
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  const statusStyle = {
    upcoming: { color: '#60a5fa', background: 'rgba(59,130,246,0.1)' },
    completed: { color: '#4ade80', background: 'rgba(74,222,128,0.1)' },
    cancelled: { color: '#f87171', background: 'rgba(248,113,113,0.1)' },
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
      <div style={{ width: '2.25rem', height: '2.25rem', border: '2px solid rgba(59,130,246,0.3)', borderTopColor: '#3B82F6', borderRadius: '9999px', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '0.4375rem 1rem',
              borderRadius: '0.625rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'all 0.2s',
              ...(filter === f
                ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff', border: 'none', boxShadow: '0 2px 12px rgba(59,130,246,0.35)' }
                : { background: 'rgba(15,32,64,0.6)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }
              ),
            }}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...cardBase, padding: '4rem 2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📅</span>
          <p style={{ color: '#94A3B8' }}>No {filter !== 'all' ? filter : ''} appointments found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(appt => (
            <div key={appt.id} style={{ ...cardBase, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                  <h4 style={{ color: '#fff', fontWeight: 500 }}>{SERVICE_LABELS[appt.service] || appt.service}</h4>
                  <span style={{ padding: '0.1875rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize', ...statusStyle[appt.status] }}>
                    {appt.status}
                  </span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                  📅 {appt.appointment_date} &nbsp;·&nbsp; 🕐 {appt.appointment_time}
                </p>
                <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.25rem' }}>Ref: #{appt.booking_ref}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: '#fff', fontWeight: 600 }}>${appt.total?.toFixed(2)}</p>
                {appt.status === 'upcoming' && (
                  <button onClick={() => cancelBooking(appt.id)} disabled={cancelling === appt.id}
                    style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: "'Inter', system-ui, sans-serif", opacity: cancelling === appt.id ? 0.6 : 1 }}>
                    {cancelling === appt.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard Page ────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'appointments' ? 'appointments' : 'profile'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('lw_token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`/api/dashboard/profile?token=${token}`)
      .then(({ data }) => setProfile(data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [token, navigate])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '2.75rem', height: '2.75rem', border: '2px solid rgba(59,130,246,0.3)', borderTopColor: '#3B82F6', borderRadius: '9999px', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  const navItems = [
    {
      id: 'profile', label: 'Profile',
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    },
    {
      id: 'appointments', label: 'Appointments',
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Sidebar */}
          <aside style={{ width: '15rem', flexShrink: 0 }}>
            <div style={{ ...cardBase, padding: '1.25rem', position: 'sticky', top: '6rem' }}>
              {/* Avatar */}
              <div style={{ textAlign: 'center', paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <svg width="28" height="28" fill="#3B82F6" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem' }}>{profile?.full_name}</p>
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.email}</p>
                {profile?.membership && (
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.1875rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa', fontSize: '0.75rem', borderRadius: '9999px' }}>
                    {PLAN_LABELS[profile.membership.plan]}
                  </span>
                )}
              </div>

              {/* Nav */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: "'Inter', system-ui, sans-serif",
                      transition: 'all 0.2s',
                      ...(activeTab === item.id
                        ? { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }
                        : { background: 'transparent', color: '#94A3B8', border: '1px solid transparent' }
                      ),
                    }}>
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Sign Out */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => { localStorage.removeItem('lw_token'); localStorage.removeItem('lw_user'); navigate('/') }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#f87171', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', textTransform: 'capitalize', letterSpacing: '-0.02em' }}>{activeTab}</h1>
            {activeTab === 'profile'
              ? <ProfileTab profile={profile} token={token} onProfileUpdate={setProfile} />
              : <AppointmentsTab token={token} />
            }
          </main>
        </div>
      </div>
    </div>
  )
}
