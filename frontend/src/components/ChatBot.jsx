import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const G    = '#C8A96E'
const G2   = '#b89256'
const BG   = '#f0efec'
const CARD = '#ffffff'
const BDR  = 'rgba(0,0,0,0.09)'
const TEXT = '#111111'
const MUTED = '#666666'

const WELCOME = {
  from: 'bot',
  text: "👋 Hi! I'm the LuxeWash assistant.\n\nI can help with:\n• 🚗 Services & pricing\n• 🏷️ Membership plans\n• 📅 Appointments & hours\n\nWhat can I help you with?",
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread]   = useState(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [open, messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text }])
    setLoading(true)
    try {
      const { data } = await axios.post('/api/chatbot/chat', { message: text })
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }])
      if (!open) setUnread(n => n + 1)
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem',
          width: 'min(360px, calc(100vw - 2rem))',
          height: '480px',
          background: CARD,
          border: `1px solid ${BDR}`,
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          display: 'flex', flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {/* Header */}
          <div style={{
            background: TEXT, padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '50%',
              background: G, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0,
            }}>🚗</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.2 }}>LuxeWash Assistant</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Services · Memberships · Appointments</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1, padding: '0.25rem',
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.625rem',
            background: BG,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '85%',
                  background: msg.from === 'user' ? TEXT : CARD,
                  color: msg.from === 'user' ? '#f0efec' : TEXT,
                  padding: '0.625rem 0.875rem',
                  borderRadius: msg.from === 'user'
                    ? '1rem 1rem 0.25rem 1rem'
                    : '1rem 1rem 1rem 0.25rem',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-line',
                  border: msg.from === 'bot' ? `1px solid ${BDR}` : 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: CARD, border: `1px solid ${BDR}`,
                  borderRadius: '1rem 1rem 1rem 0.25rem',
                  padding: '0.625rem 0.875rem',
                  display: 'flex', gap: '0.3rem', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(j => (
                    <span key={j} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: G, display: 'inline-block',
                      animation: `bounce 1s ease-in-out ${j * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div style={{
            padding: '0.5rem 0.75rem 0',
            background: CARD,
            borderTop: `1px solid ${BDR}`,
            display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
          }}>
            {['Services', 'Memberships', 'Book Now', 'Hours'].map(q => (
              <button key={q} onClick={() => { setInput(q); }}
                style={{
                  background: 'transparent', border: `1px solid ${BDR}`,
                  borderRadius: '2rem', padding: '0.25rem 0.625rem',
                  fontSize: '0.75rem', color: MUTED, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.color = MUTED }}
              >{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '0.625rem 0.75rem 0.75rem',
            background: CARD,
            display: 'flex', gap: '0.5rem', alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about services, plans, hours…"
              style={{
                flex: 1, background: BG, border: `1px solid ${BDR}`,
                borderRadius: '0.5rem', padding: '0.625rem 0.875rem',
                fontSize: '0.875rem', color: TEXT, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = G}
              onBlur={e => e.target.style.borderColor = BDR}
            />
            <button onClick={send} disabled={!input.trim() || loading}
              style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
                background: input.trim() && !loading ? G : BDR,
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s', flexShrink: 0,
                color: 'white', fontSize: '1rem',
              }}
            >→</button>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: '3.5rem', height: '3.5rem', borderRadius: '50%',
          background: open ? TEXT : G,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', zIndex: 9999,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with LuxeWash"
      >
        {open ? '✕' : '💬'}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            width: '1.1rem', height: '1.1rem', borderRadius: '50%',
            background: '#ef4444', color: 'white',
            fontSize: '0.65rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid white',
          }}>{unread}</span>
        )}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}