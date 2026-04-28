'use client'

import { useState } from 'react'

type Resultado = {
  display_name: string
  lat: string
  lon: string
}

export default function Buscador({ onUbicacion }: { onUbicacion: (lat: number, lng: number, zoom: number) => void }) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [cargando, setCargando] = useState(false)

  async function buscar() {
    if (!query.trim()) return
    setCargando(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' Ciudad de Mexico')}&format=json&limit=4&accept-language=es`
      )
      const data = await res.json()
      setResultados(data)
    } catch {
      console.error('Error buscando ubicacion')
    }
    setCargando(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') buscar()
  }

  function seleccionar(r: Resultado) {
    onUbicacion(parseFloat(r.lat), parseFloat(r.lon), 15)
    setQuery(r.display_name.split(',')[0])
    setResultados([])
  }

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            window.scrollTo(0, 0)
            document.body.scrollTop = 0
         }}
          placeholder="Busca una zona... ej: Coyoacán"
          style={{
            flex: 1,
            border: '1.5px solid #e5e7eb',
            borderRadius: 20,
            padding: '8px 14px',
            fontSize: 16,
            color: '#111',
            background: '#fff',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        <button
          onClick={buscar}
          style={{
            border: 'none',
            borderRadius: 20,
            padding: '8px 14px',
            background: '#ec4899',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(236,72,153,0.3)'
          }}
        >
          {cargando ? '...' : 'Buscar'}
        </button>
      </div>

      {resultados.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }}>
          {resultados.map((r, i) => (
            <div
              key={i}
              onClick={() => seleccionar(r)}
              style={{
                padding: '10px 14px',
                fontSize: 13,
                color: '#111',
                cursor: 'pointer',
                borderBottom: i < resultados.length - 1 ? '1px solid #f3f4f6' : 'none',
              }}
            >
              📍 {r.display_name.split(',').slice(0, 2).join(',')}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}