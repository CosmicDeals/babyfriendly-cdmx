'use client'

export default function SplashScreen({ onEntrar }: { onEntrar: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #fff 0%, #f0fdfa 60%, #ccfbf1 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '40px 28px', textAlign: 'center' }}>

      {/* Logo */}
      <svg width="160" height="90" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 20 }}>
        <g transform="translate(8, 14)">
          <circle cx="18" cy="12" r="7" fill="#14b8a6"/>
          <path d="M8 38 Q10 24 18 24 Q26 24 28 38" fill="#14b8a6"/>
          <line x1="8" y1="30" x2="2" y2="38" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round"/>
          <line x1="28" y1="30" x2="34" y2="38" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round"/>
          <line x1="14" y1="38" x2="12" y2="52" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round"/>
          <line x1="22" y1="38" x2="24" y2="52" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g transform="translate(98, 14)">
          <circle cx="14" cy="9" r="7.5" fill="#99f6e4"/>
          <circle cx="5" cy="5" r="3" fill="#99f6e4"/>
          <circle cx="23" cy="5" r="3" fill="#99f6e4"/>
          <path d="M7 18 Q10 16 14 16 Q18 16 21 18 L23 28 Q18 32 14 32 Q10 32 5 28 Z" fill="#99f6e4"/>
          <line x1="7" y1="20" x2="0" y2="10" stroke="#99f6e4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="0" y1="10" x2="2" y2="4" stroke="#99f6e4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="21" y1="20" x2="28" y2="10" stroke="#99f6e4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="28" y1="10" x2="26" y2="4" stroke="#99f6e4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="10" y1="32" x2="6" y2="44" stroke="#99f6e4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="18" y1="32" x2="22" y2="44" stroke="#99f6e4" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <text x="68" y="42" fontSize="12" fill="#14b8a6">♥</text>
        <path d="M0 75 Q20 67 35 73 Q55 63 80 71 Q105 63 125 69 Q140 63 160 67 L160 90 L0 90 Z" fill="#ccfbf1"/>
      </svg>

      {/* Texto */}
      <div style={{ marginBottom: 8 }}>
  <div style={{ fontFamily: 'GoodDays', fontSize: 52, color: '#111', lineHeight: 1 }}>
    Peque<span style={{ color: '#14b8a6' }}>Maps</span>
  </div>
  <div style={{ fontFamily: 'GoodDays', fontSize: 42, color: '#14b8a6', letterSpacing: 1, marginTop: 4 }}>CDMX</div>
</div>

      <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 10, maxWidth: 300 }}>
        Salir con tus hijos en la ciudad no debería ser complicado. Te ayudamos a encontrar 
        <br /><strong style={{ color: '#111', fontWeight: 800, fontSize: 15 }}>lugares que sí piensan en las familias.</strong>
      </div>

      <div style={{ display: 'inline-block', background: '#f0fdfa', color: '#14b8a6', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600, marginBottom: 32, border: '1px solid #99f6e4' }}>
        ✨ Gratis · Hecho en comunidad
      </div>

      <button
        onClick={onEntrar}
        style={{ background: '#14b8a6', color: 'white', border: 'none', borderRadius: 9999, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(20,184,166,0.3)', width: '100%', maxWidth: 300, outline: 'none' }}
      >
        Explorar el mapa →
      </button>

    </div>
  )
}