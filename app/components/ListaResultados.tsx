'use client'

type Lugar = {
  id: string
  nombre: string
  tipo: string
  direccion: string
  latitud: number
  longitud: number
  instalaciones?: any[]
}

const ICONOS: Record<string, string> = {
  cambiador_bebe: '🚼',
  sillas_bebe: '🪑',
  lactario: '🤱',
  area_juegos: '🎠',
  nineras: '👧',
  menu_infantil: '🍽',
  accesibilidad: '♿',
  estacionamiento_accesible: '🅿',
}

export default function ListaResultados({
  lugares,
  onSeleccionar,
  onCerrar,
}: {
  lugares: Lugar[]
  onSeleccionar: (lugar: Lugar) => void
  onCerrar: () => void
}) {
  if (lugares.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '5rem',
      left: 0,
      right: 0,
      zIndex: 9998,
      background: '#fff',
      borderRadius: '20px 20px 0 0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      maxHeight: '45vh',
      overflowY: 'auto',
    }}>
      {/* Handle y título con cerrar */}
<div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
  <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e5e7eb' }} />
</div>
<div style={{ padding: '0 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>
    {lugares.length} lugar{lugares.length !== 1 ? 'es' : ''} encontrado{lugares.length !== 1 ? 's' : ''} en tu zona
  </div>
  <span
    onClick={onCerrar}
    style={{ cursor: 'pointer', fontSize: 16, color: '#aaa', lineHeight: 1 }}
  >
    ✕
  </span>
</div>

      {/* Lista */}
      {lugares.map(lugar => (
        <div
          key={lugar.id}
          onClick={() => onSeleccionar(lugar)}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #f3f4f6',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{lugar.nombre}</div>
            <div style={{ fontSize: 11, color: '#111', fontWeight: 500, background: '#FCD34D', padding: '2px 8px', borderRadius: 20 }}>{lugar.tipo}</div>
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{lugar.direccion}</div>
          {lugar.instalaciones?.[0] && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
              {Object.entries(ICONOS).map(([key, emoji]) =>
                lugar.instalaciones![0][key] ? (
                  <span key={key} style={{ fontSize: 14 }}>{emoji}</span>
                ) : null
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}