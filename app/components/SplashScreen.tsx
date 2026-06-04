'use client'

export default function SplashScreen({ onEntrar }: { onEntrar: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #fff 0%, #fffbeb 40%, #fef9c3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '40px 28px', textAlign: 'center' }}>

      {/* Logo */}
      <img 
      src="/logo-pequemaps.svg" 
      alt="PequeMaps logo"
      style={{ width: '10vw', maxWidth: 200, minWidth: 120, marginBottom: 20 }}
    />

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