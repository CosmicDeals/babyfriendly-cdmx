'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

type Resultado = {
  display_name: string
  lat: string
  lon: string
}

type Lugar = {
  id: string
  nombre: string
  tipo: string
  direccion: string
  latitud: number
  longitud: number
}

type Props = {
  onUbicacion: (lat: number, lng: number, zoom: number) => void
  onLugaresEncontrados: (lugares: Lugar[]) => void
}

export default function Buscador({ onUbicacion, onLugaresEncontrados }: Props) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [cargando, setCargando] = useState(false)
  const [noEncontrado, setNoEncontrado] = useState(false)

  async function buscar() {
    if (!query.trim()) return
    setNoEncontrado(false)
    setCargando(true)

    // Primero buscamos en nuestra base de datos
    const { data: lugares } = await supabase
      .from('lugares')
      .select('*, instalaciones(*)')
      .ilike('nombre', `%${query}%`)
      .limit(5)

    if (lugares && lugares.length > 0) {
  onLugaresEncontrados(lugares)
  setResultados([])
  setCargando(false)
  return
} else if (lugares && lugares.length === 0) {
  onLugaresEncontrados([])
  setNoEncontrado(true)
  setCargando(false)
  return
}

    // Si no hay resultados en la base de datos, buscamos zonas geográficas
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' Ciudad de Mexico')}&format=json&limit=4&accept-language=es`
      )
      const data = await res.json()
      setResultados(data)
      onLugaresEncontrados([])
    } catch {
      console.error('Error buscando')
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
          placeholder="Busca un lugar o zona..."
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
            background: '#FCD34D',
            color: '#111',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(252,211,77,0.3)'
          }}
        >
          {cargando ? '...' : 'Buscar'}
        </button>
      </div>

      {noEncontrado && (
  <div style={{
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    padding: '14px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  }}>
    <div style={{ fontSize: 13, color: '#555' }}>
      No encontramos ese lugar... <span style={{ color: '#B45309', fontWeight: 600 }}>¿Lo agregas tú? 😊</span>
    </div>
    <span onClick={() => setNoEncontrado(false)} style={{ cursor: 'pointer', fontSize: 16, color: '#aaa' }}>✕</span>
  </div>
)}

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
          overflow: 'hidden',
          zIndex: 9999
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: 11, color: '#aaa' }}>Zonas sugeridas</span>
            <span onClick={() => setResultados([])} style={{ cursor: 'pointer', fontSize: 16, color: '#aaa', lineHeight: 1 }}>✕</span>
          </div>
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