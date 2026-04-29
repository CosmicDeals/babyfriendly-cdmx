'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen({ onEntrar }: { onEntrar: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const visto = localStorage.getItem('splash_visto')
    if (visto) {
      setVisible(false)
      onEntrar()
    }
  }, [])

  function handleEntrar() {
    localStorage.setItem('splash_visto', 'true')
    setVisible(false)
    onEntrar()
  }

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #fff 0%, #fdf2f8 60%, #fce7f3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '40px 28px', textAlign: 'center' }}>

      {/* Logo */}
      <svg width="160" height="90" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 20 }}>
        <g transform="translate(8, 14)">
          <circle cx="18" cy="12" r="7" fill="#ec4899"/>
          <path d="M8 38 Q10 24 18 24 Q26 24 28 38" fill="#ec4899"/>
          <line x1="8" y1="30" x2="2" y2="38" stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
          <line x1="28" y1="30" x2="34" y2="38" stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
          <line x1="14" y1="38" x2="12" y2="52" stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
          <line x1="22" y1="38" x2="24" y2="52" stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g transform="translate(98, 14)">
          <circle cx="14" cy="9" r="7.5" fill="#f9a8d4"/>
          <circle cx="5" cy="5" r="3" fill="#f9a8d4"/>
          <circle cx="23" cy="5" r="3" fill="#f9a8d4"/>
          <path d="M7 18 Q10 16 14 16 Q18 16 21 18 L23 28 Q18 32 14 32 Q10 32 5 28 Z" fill="#f9a8d4"/>
          <line x1="7" y1="20" x2="0" y2="10" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="0" y1="10" x2="2" y2="4" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="21" y1="20" x2="28" y2="10" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="28" y1="10" x2="26" y2="4" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="10" y1="32" x2="6" y2="44" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="18" y1="32" x2="22" y2="44" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <text x="48" y="42" fontSize="12" fill="#ec4899">♥</text>
        <path d="M0 75 Q20 67 35 73 Q55 63 80 71 Q105 63 125 69 Q140 63 160 67 L160 90 L0 90 Z" fill="#fce7f3"/>
      </svg>

      {/* Texto */}
      <div style={{ fontSize: 32, fontWeight: 800, color: '#111', letterSpacing: -1, marginBottom: 8 }}>
        Baby<span style={{ color: '#ec4899' }}>Friendly</span>
      </div>

      <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 10, maxWidth: 300 }}>
        Salir con tus hijos en la ciudad no debería ser complicado. Te ayudamos a encontrar los <strong style={{ color: '#111', fontWeight: 800 }}> lugares que sí piensan en las familias.</strong>
      </div>

      <div style={{ display: 'inline-block', background: '#fdf2f8', color: '#ec4899', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600, marginBottom: 32, border: '1px solid #fbcfe8' }}>
        ✨ Gratis · Hecho en comunidad
      </div>

      <button
        onClick={handleEntrar}
        style={{ background: '#ec4899', color: 'white', border: 'none', borderRadius: 9999, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(236,72,153,0.3)', width: '100%', maxWidth: 300 }}
      >
        Explorar el mapa →
      </button>

      <div style={{ fontSize: 11, color: '#aaa', marginTop: 16 }}>Ciudad de México</div>
    </div>
  )
}