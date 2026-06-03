'use client'

export default function SplashScreen({ onEntrar }: { onEntrar: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #fff 0%, #fffbeb 40%, #fef9c3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '40px 28px', textAlign: 'center' }}>

      {/* Logo */}
      <div className="splash-logo-wrap"></div>
      <svg width="160" height="90" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 20 }}>
        <g transform="translate(8, 14)">
          <circle cx="18" cy="16" r="7" fill="#d7b030"/>
          <path d="M8 38 Q10 24 18 24 Q26 24 28 38" fill="#d7b030"/>
          <line x1="8" y1="30" x2="2" y2="38" stroke="#d7b030" strokeWidth="3" strokeLinecap="round"/>
          <line x1="28" y1="30" x2="34" y2="38" stroke="#d7b030" strokeWidth="3" strokeLinecap="round"/>
          <line x1="14" y1="38" x2="12" y2="52" stroke="#d7b030" strokeWidth="3" strokeLinecap="round"/>
          <line x1="22" y1="38" x2="24" y2="52" stroke="#d7b030" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g transform="translate(98, 14)">
          <circle cx="24" cy="19" r="7.5" fill="#FCD34D"/>
          <circle cx="15" cy="15" r="3" fill="#FCD34D"/>
          <circle cx="35" cy="15" r="3" fill="#FCD34D"/>
          <path d="M17 28 Q30 26 24 26 Q28 26 31 28 L33 38 Q28 42 24 42 Q20 42 15 38 Z" fill="#FCD34D"/>
          <line x1="17" y1="28" x2="10" y2="22" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
          <line x1="10" y1="22" x2="12" y2="16" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
          <line x1="31" y1="28" x2="38" y2="20" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
          <line x1="38" y1="20" x2="36" y2="14" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
          <line x1="20" y1="32" x2="16" y2="50" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
          <line x1="28" y1="32" x2="32" y2="50" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <text x="68" y="42" fontSize="25" fill="#111">♥</text>
        <path d="M0 75 Q20 67 35 73 Q55 63 80 71 Q105 63 125 69 Q140 63 160 67 L160 90 L0 90 Z" fill="#FEF08A"/>
      </svg>
      

      {/* Texto */}
      <div style={{ marginBottom: 8 }}>
  <div style={{ fontFamily: 'GoodDays', fontSize: 52, color: '#3a2f2f', lineHeight: 1 }}>
    Peque<span style={{ color: '#FCD34D' }}>Maps</span>
  </div>
  <div style={{ fontFamily: 'GoodDays', fontSize: 42, color: '#d7b030', letterSpacing: 1, marginTop: 4 }}>CDMX</div>
</div>


      <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 25, maxWidth: 300 }}>
        Salir con tus hijos en la ciudad no debería ser complicado. Te ayudamos a encontrar 
        <br /><strong style={{ color: '#111', fontWeight: 800, fontSize: 15 }}>lugares y eventos que sí piensan en las familias.</strong>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
  <span style={{ fontSize: 16 }}>✨</span>
  <div style={{
    color: '#111',
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 16px',
    border: '2px solid #d7b030',
    borderRadius: 4,
    background: 'linear-gradient(135deg, #FEF08A, #FCD34D)',
    boxShadow: '0 0 0 1px #FCD34D, inset 0 0 0 1px #FEF9C3, 2px 2px 0px #d7b030',
    letterSpacing: 1,
    textTransform: 'uppercase',
  }}>
    Gratis · Hecho en comunidad
  </div>
  <span style={{ fontSize: 16 }}>✨</span>
</div>

      <button
        onClick={onEntrar}
        style={{ background: '#FCD34D', color: '#60320e', border: 'none', borderRadius: 9999, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(219, 196, 23, 0.3)', width: '100%', maxWidth: 300, outline: 'none', textAlign: 'center'}}
      >
        EXPLORA EL MAPA 
      </button>

      <a href="/eventos"
  style={{
    display: 'block',
    background: '#FCD34D',
    color: '#60320e',
    border: '2px solid #FCD34D',
    borderRadius: 9999,
    padding: '12px 32px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    width: '100%',
    maxWidth: 300,
    marginTop: 10,
  }}
>
  VER EVENTOS
</a>
  </div>
  )
}