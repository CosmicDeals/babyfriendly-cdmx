'use client'

const FILTROS = [
  { key: 'cambiador_bebe', emoji: '&#x1F6BC;', label: 'Cambiador' },
  { key: 'sillas_bebe', emoji: '&#x1FA91;', label: 'Silla bebé' },
  { key: 'lactario', emoji: '&#x1F931;', label: 'Lactario' },
  { key: 'area_juegos', emoji: '&#x1F6DD;', label: 'Área juegos' },
  { key: 'nineras', emoji: '&#x1F467;', label: 'Niñeras' },
  { key: 'menu_infantil', emoji: '&#x1F37D;', label: 'Menú infantil' },
  { key: 'accesibilidad', emoji: '&#x267F;', label: 'Accesibilidad' },
  { key: 'estacionamiento_accesible', emoji: '&#x1F17F;', label: 'Estacionamiento' },
]

type Props = {
  filtrosActivos: string[]
  onToggle: (key: string) => void
}

export default function Filtros({ filtrosActivos, onToggle }: Props) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      paddingBottom: 4,
      scrollbarWidth: 'none',
    }}>
      {FILTROS.map(f => (
        <button
          key={f.key}
          onClick={() => onToggle(f.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 10px',
            borderRadius: 20,
            border: `1.5px solid ${filtrosActivos.includes(f.key) ? '#ec4899' : '#e5e7eb'}`,
            background: filtrosActivos.includes(f.key) ? '#ec4899' : '#fff',
            color: filtrosActivos.includes(f.key) ? '#fff' : '#555',
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
          dangerouslySetInnerHTML={{
            __html: `${f.emoji} ${f.label}`
          }}
        />
      ))}
    </div>
  )
}