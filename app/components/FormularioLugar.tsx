'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import MapSelector from './MapSelector'

const TIPOS = [
  { emoji: '🍽️', label: 'Restaurante' },
  { emoji: '☕', label: 'Café' },
  { emoji: '🏬', label: 'Centro comercial' },
  { emoji: '✈️', label: 'Aeropuerto' },
  { emoji: '🏛️', label: 'Oficina gob.' },
  { emoji: '🏥', label: 'Hospital' },
  { emoji: '🌳', label: 'Parque' },
  { emoji: '📦', label: 'Otro' },
]

const INSTALACIONES = [
  { key: 'cambiador_bebe', emoji: '🚼', label: 'Cambiador para bebés' },
  { key: 'sillas_bebe', emoji: '🪑', label: 'Periquera o silla bebé' },
  { key: 'lactario', emoji: '🤱', label: 'Sala de lactancia' },
  { key: 'area_juegos', emoji: '🎠', label: 'Área de juegos' },
  { key: 'nineras', emoji: '👩‍👧', label: 'Niñeras en área de juegos' },
  { key: 'menu_infantil', emoji: '🍽️', label: 'Menú infantil' },
  { key: 'accesibilidad', emoji: '♿', label: 'Accesibilidad (rampas y/o elevador)' },
  { key: 'estacionamiento', emoji: '🅿️', label: 'Estacionamiento o valet accesible' },
]

export default function FormularioLugar({ onCerrar }: { onCerrar: () => void }) {
  const [paso, setPaso] = useState(1)
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [latitud, setLatitud] = useState<number | null>(null)
  const [longitud, setLongitud] = useState<number | null>(null)
  const [direccion, setDireccion] = useState('')
  const [detalles, setDetalles] = useState('')
  const [instalaciones, setInstalaciones] = useState<Record<string, boolean>>({})
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  function toggleInstalacion(key: string) {
    setInstalaciones(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function obtenerDireccion(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`
      )
      const data = await res.json()
      setDireccion(data.display_name || '')
    } catch {
      setDireccion('')
    }
  }

  function handleMapClick() {
    // Se maneja desde el componente MapSelector
  }

  async function handleSubmit() {
    if (!nombre || !tipo || !latitud || !longitud) {
      alert('Por favor completa todos los campos')
      return
    }
    setCargando(true)

    const { data, error } = await supabase
      .from('lugares')
      .insert([{
        nombre,
        tipo,
        direccion: detalles ? `${direccion} — ${detalles}` : direccion,
        latitud,
        longitud
      }])
      .select()

    if (error || !data) {
      alert('Hubo un error al guardar')
      setCargando(false)
      return
    }

    await supabase.from('instalaciones').insert([{
  lugar_id: data[0].id,
  cambiador_bebe: instalaciones.cambiador_bebe || false,
  sillas_bebe: instalaciones.sillas_bebe || false,
  lactario: instalaciones.lactario || false,
  area_juegos: instalaciones.area_juegos || false,
  nineras: instalaciones.nineras || false,
  menu_infantil: instalaciones.menu_infantil || false,
  accesibilidad: instalaciones.accesibilidad || false,
  estacionamiento_accesible: instalaciones.estacionamiento || false,
}])
    setCargando(false)
    setExito(true)
    setTimeout(() => onCerrar(), 2000)
  }

  const progreso = (paso / 3) * 100

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 380, margin: '0 16px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ background: '#ec4899', padding: '16px', color: 'white', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>🍼 Agregar lugar baby friendly</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: paso >= n ? 'white' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{ height: 4, background: '#fce7f3' }}>
          <div style={{ height: '100%', background: '#ec4899', width: `${progreso}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 16px', flex: 1 }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 18, color: '#16a34a', fontWeight: 600 }}>
              🎉 ¡Lugar agregado con éxito!
            </div>
          ) : (
            <>
              {/* Paso 1 */}
              {paso === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>¿Qué lugar es? 📍</div>
                  <input
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Nombre del lugar (ej: Café Toscano)"
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
                  />
                  <div style={{ fontSize: 12, color: '#777' }}>¿Qué tipo de lugar es?</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {TIPOS.map(t => (
                      <button
                        key={t.label}
                        onClick={() => setTipo(t.label)}
                        style={{
                          border: `1.5px solid ${tipo === t.label ? '#ec4899' : '#d1d5db'}`,
                          borderRadius: 12,
                          padding: '10px 8px',
                          fontSize: 12,
                          cursor: 'pointer',
                          color: tipo === t.label ? '#be185d' : '#444',
                          background: tipo === t.label ? '#fdf2f8' : '#fff',
                          fontWeight: tipo === t.label ? 600 : 400,
                        }}
                      >
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Paso 2 */}
              {paso === 2 && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>¿Dónde está? 🗺️</div>
    <div style={{ fontSize: 12, color: '#777' }}>Toca el mapa para marcar — la dirección aparece sola</div>
    <MapSelector
      onUbicacionSeleccionada={(lat, lng) => {
        setLatitud(lat)
        setLongitud(lng)
        obtenerDireccion(lat, lng)
      }}
    />
    {direccion && (
      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d' }}>Dirección detectada</div>
          <div style={{ fontSize: 11, color: '#166534' }}>{direccion}</div>
        </div>
      </div>
    )}
    <input
      value={detalles}
      onChange={e => setDetalles(e.target.value)}
      placeholder="Detalles extra (opcional, ej: piso 2)"
      style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
    />
  </div>
)}
              {/* Paso 3 */}
              {paso === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>¿Qué instalaciones tiene? ✨</div>
                  <div style={{ fontSize: 12, color: '#777' }}>Selecciona todas las que apliquen</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {INSTALACIONES.map(inst => (
                      <button
                        key={inst.key}
                        onClick={() => toggleInstalacion(inst.key)}
                        style={{
                          border: `1.5px solid ${instalaciones[inst.key] ? '#ec4899' : '#d1d5db'}`,
                          borderRadius: 12,
                          padding: '12px 6px',
                          fontSize: 11,
                          cursor: 'pointer',
                          color: instalaciones[inst.key] ? '#be185d' : '#444',
                          background: instalaciones[inst.key] ? '#fdf2f8' : '#fff',
                          fontWeight: instalaciones[inst.key] ? 600 : 400,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 5,
                          lineHeight: 1.3,
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{inst.emoji}</span>
                        {inst.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Botones */}
        {!exito && (
          <div style={{ padding: '14px 16px', borderTop: '2px solid #f3f4f6', display: 'flex', gap: 10 }}>
            <button
              onClick={() => paso > 1 ? setPaso(paso - 1) : onCerrar()}
              style={{ flex: 1, border: 'none', borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 700, color: '#fff', background: '#6b7280', cursor: 'pointer' }}
            >
              {paso === 1 ? '✕ Cancelar' : '← Atrás'}
            </button>
            <button
              onClick={() => paso < 3 ? setPaso(paso + 1) : handleSubmit()}
              disabled={cargando}
              style={{ flex: 2, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, color: '#fff', background: cargando ? '#f9a8d4' : '#ec4899', cursor: 'pointer' }}
            >
              {paso < 3 ? 'Siguiente →' : cargando ? 'Guardando...' : '✓ Agregar lugar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}