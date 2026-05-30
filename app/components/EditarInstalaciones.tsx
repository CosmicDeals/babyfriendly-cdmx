'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import MapSelector from './MapSelector'

const INSTALACIONES = [
  { key: 'cambiador_bebe', emoji: '🚼', label: 'Cambiador para bebés' },
  { key: 'sillas_bebe', emoji: '🪑', label: 'Periquera o silla bebé' },
  { key: 'lactario', emoji: '🤱', label: 'Sala de lactancia' },
  { key: 'area_juegos', emoji: '🎠', label: 'Área de juegos' },
  { key: 'nineras', emoji: '👧', label: 'Niñeras en área de juegos' },
  { key: 'menu_infantil', emoji: '🍽', label: 'Menú infantil' },
  { key: 'accesibilidad', emoji: '♿', label: 'Accesibilidad (rampas y/o elevador)' },
  { key: 'estacionamiento_accesible', emoji: '🅿', label: 'Estacionamiento o valet accesible' },
  { key: 'pet_friendly', emoji: '🐾', label: 'Pet friendly' },
]

type Props = {
  lugarId: string
  nombreLugar: string
  instalacionesActuales: Record<string, boolean>
  latitudActual: number
  longitudActual: number
  onCerrar: () => void
  onGuardado: () => void
}

export default function EditarInstalaciones({ lugarId, nombreLugar, instalacionesActuales, latitudActual, longitudActual, onCerrar, onGuardado }: Props) {
  const [instalaciones, setInstalaciones] = useState<Record<string, boolean>>(instalacionesActuales)
  const [latitud, setLatitud] = useState<number>(latitudActual)
  const [longitud, setLongitud] = useState<number>(longitudActual)
  const [centroMapa, setCentroMapa] = useState<[number, number]>([latitudActual, longitudActual])
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)
  const [tab, setTab] = useState<'instalaciones' | 'ubicacion'>('instalaciones')
  const [direccionEditada, setDireccionEditada] = useState('')

  function toggleInstalacion(key: string) {
    setInstalaciones(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleGuardar() {
    setCargando(true)

    const { error: errorInst } = await supabase
      .from('instalaciones')
      .update(instalaciones)
      .eq('lugar_id', lugarId)

    const { error: errorLugar } = await supabase
      .from('lugares')
      .update({ 
        latitud, 
        longitud,
        ...(direccionEditada ? { direccion: direccionEditada } : {})
      })
      .eq('id', lugarId)  

    if (errorInst || errorLugar) {
      alert('Hubo un error al guardar')
      setCargando(false)
      return
    }

    setCargando(false)
    setExito(true)
    setTimeout(() => {
      onGuardado()
      onCerrar()
    }, 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 380, margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#FCD34D', padding: '16px', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Editar lugar</div>
          <div style={{ fontSize: 12, color: '#111', opacity: 0.7, marginTop: 4 }}>{nombreLugar}</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6' }}>
          <button
            onClick={() => setTab('instalaciones')}
            style={{ flex: 1, padding: '12px', fontSize: 13, fontWeight: tab === 'instalaciones' ? 700 : 400, color: tab === 'instalaciones' ? '#111' : '#888', background: 'transparent', border: 'none', borderBottom: tab === 'instalaciones' ? '2px solid #FCD34D' : 'none', cursor: 'pointer' }}
          >
            Instalaciones
          </button>
          <button
            onClick={() => setTab('ubicacion')}
            style={{ flex: 1, padding: '12px', fontSize: 13, fontWeight: tab === 'ubicacion' ? 700 : 400, color: tab === 'ubicacion' ? '#111' : '#888', background: 'transparent', border: 'none', borderBottom: tab === 'ubicacion' ? '2px solid #FCD34D' : 'none', cursor: 'pointer' }}
          >
            Ubicación
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 16px' }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 16, color: '#16a34a', fontWeight: 600 }}>
              ✅ ¡Cambios guardados!
            </div>
          ) : (
            <>
              {tab === 'instalaciones' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {INSTALACIONES.map(inst => (
                    <button
                      key={inst.key}
                      onClick={() => toggleInstalacion(inst.key)}
                      style={{
                        border: `1.5px solid ${instalaciones[inst.key] ? '#FCD34D' : '#d1d5db'}`,
                        borderRadius: 12,
                        padding: '12px 6px',
                        fontSize: 11,
                        cursor: 'pointer',
                        color: instalaciones[inst.key] ? '#111' : '#444',
                        background: instalaciones[inst.key] ? '#FCD34D' : '#fff',
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
              )}

              {tab === 'ubicacion' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12, color: '#777' }}>Mueve el pin para corregir la ubicación del lugar</div>
                  <MapSelector
                    onUbicacionSeleccionada={(lat, lng) => {
                      setLatitud(lat)
                      setLongitud(lng)
                    }}
                    centro={centroMapa}
                    pinInicial={{ lat: latitudActual, lng: longitudActual }}
                  />
                  <input
                    value={direccionEditada}
                    onChange={e => setDireccionEditada(e.target.value)}
                    placeholder="Dirección completa (ej: Orizaba 42, Roma Norte)"
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
/>
                  <div style={{ background: '#FFFBEB', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#B45309' }}>
                    📍 Toca el mapa para mover el pin a la ubicación correcta
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
              onClick={onCerrar}
              style={{ flex: 1, border: 'none', borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 700, color: '#fff', background: '#6b7280', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={cargando}
              style={{ flex: 2, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, color: '#111', background: cargando ? '#FEF08A' : '#FCD34D', cursor: 'pointer' }}
            >
              {cargando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}