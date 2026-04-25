'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const INSTALACIONES = [
  { key: 'cambiador_bebe', emoji: '🚼', label: 'Cambiador para bebés' },
  { key: 'sillas_bebe', emoji: '🪑', label: 'Periquera o silla bebé' },
  { key: 'lactario', emoji: '🤱', label: 'Sala de lactancia' },
  { key: 'area_juegos', emoji: '🎠', label: 'Área de juegos' },
  { key: 'nineras', emoji: '👩‍👧', label: 'Niñeras en área de juegos' },
  { key: 'menu_infantil', emoji: '🍽️', label: 'Menú infantil' },
  { key: 'accesibilidad', emoji: '♿', label: 'Accesibilidad (rampas y/o elevador)' },
  { key: 'estacionamiento_accesible', emoji: '🅿️', label: 'Estacionamiento o valet accesible' },
]

type Props = {
  lugarId: string
  instalacionesActuales: Record<string, boolean>
  onCerrar: () => void
  onGuardado: () => void
}

export default function EditarInstalaciones({ lugarId, instalacionesActuales, onCerrar, onGuardado }: Props) {
  const [instalaciones, setInstalaciones] = useState<Record<string, boolean>>(instalacionesActuales)
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  function toggleInstalacion(key: string) {
    setInstalaciones(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleGuardar() {
    setCargando(true)

    const { error } = await supabase
      .from('instalaciones')
      .update(instalaciones)
      .eq('lugar_id', lugarId)

    if (error) {
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
        <div style={{ background: '#ec4899', padding: '16px', color: 'white', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>✏️ Editar instalaciones</div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 16px' }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 18, color: '#16a34a', fontWeight: 600 }}>
              ✅ ¡Información actualizada!
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: '#777', marginBottom: 12 }}>
                Selecciona todas las instalaciones disponibles en este lugar
              </div>
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
              style={{ flex: 2, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, color: '#fff', background: cargando ? '#f9a8d4' : '#ec4899', cursor: 'pointer' }}
            >
              {cargando ? 'Guardando...' : '✓ Guardar cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}