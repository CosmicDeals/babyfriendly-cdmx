'use client'

const FILTROS_INSTALACIONES = [
  { key: 'cambiador_bebe', emoji: '&#x1F6BC;', label: 'Cambiador' },
  { key: 'sillas_bebe', emoji: '&#x1FA91;', label: 'Silla bebé' },
  { key: 'lactario', emoji: '&#x1F931;', label: 'Lactario' },
  { key: 'area_juegos', emoji: '&#x1F6DD;', label: 'Área juegos' },
  { key: 'nineras', emoji: '&#x1F467;', label: 'Niñeras' },
  { key: 'menu_infantil', emoji: '&#x1F37D;', label: 'Menú infantil' },
  { key: 'accesibilidad', emoji: '&#x267F;', label: 'Accesibilidad' },
  { key: 'estacionamiento_accesible', emoji: '&#x1F17F;', label: 'Estacionamiento' },
  { key: 'pet_friendly', emoji: '🐾', label: 'Pet friendly' },
]

const TIPOS = [
  { key: 'Restaurante', emoji: '🍽️', label: 'Restaurante' },
  { key: 'Café', emoji: '☕', label: 'Café' },
  { key: 'Ludoteca', emoji: '🎪', label: 'Ludoteca' },
  { key: 'Parque', emoji: '🌳', label: 'Parque' },
  { key: 'Museo', emoji: '🏛️', label: 'Museo' },
  { key: 'Librería', emoji: '📚', label: 'Librería' },
  { key: 'Centro comercial', emoji: '🏬', label: 'C.Comercial' },
  { key: 'Aeropuerto', emoji: '✈️', label: 'Aeropuerto' },
  { key: 'Oficina', emoji: '🏛️', label: 'Oficina' },
  { key: 'Hospital', emoji: '🏥', label: 'Hospital' },
  { key: 'Otro', emoji: '📦', label: 'Otro' },
]

type Props = {
  filtrosActivos: string[]
  onToggle: (key: string) => void
  tiposActivos: string[]
  onToggleTipo: (key: string) => void
}

export default function Filtros({ filtrosActivos, onToggle, tiposActivos, onToggleTipo }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Filtros por tipo de lugar */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        {TIPOS.map(t => (
          <button
            key={t.key}
            onClick={() => onToggleTipo(t.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 20,
              border: `1.5px solid ${tiposActivos.includes(t.key) ? '#FCD34D' : '#e5e7eb'}`,
              background: tiposActivos.includes(t.key) ? '#FCD34D' : '#fff',
              color: tiposActivos.includes(t.key) ? '#111' : '#555',
              fontSize: 11,
              fontWeight: tiposActivos.includes(t.key) ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Filtros por instalación */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {FILTROS_INSTALACIONES.map(f => (
          <button
            key={f.key}
            onClick={() => onToggle(f.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 20,
              border: `1.5px solid ${filtrosActivos.includes(f.key) ? '#FCD34D' : '#e5e7eb'}`,
              background: filtrosActivos.includes(f.key) ? '#FCD34D' : '#fff',
              color: filtrosActivos.includes(f.key) ? '#111' : '#555',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}
            dangerouslySetInnerHTML={{ __html: `${f.emoji} ${f.label}` }}
          />
        ))}
      </div>
    </div>
  )
}