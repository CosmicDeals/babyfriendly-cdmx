'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const TIPOS_EVENTO = [
  { key: 'Teatro', emoji: '🎭' },
  { key: 'Festival', emoji: '🎪' },
  { key: 'Música', emoji: '🎵' },
  { key: 'Deporte', emoji: '⚽' },
  { key: 'Arte', emoji: '🎨' },
  { key: 'Cine', emoji: '🎬' },
  { key: 'Naturaleza', emoji: '🌿' },
  { key: 'Educativo', emoji: '📚' },
  { key: 'Otro', emoji: '✨' },
]

type Evento = {
  id: string
  nombre: string
  tipo: string
  descripcion: string
  direccion: string
  fecha_inicio: string
  fecha_fin: string
  imagen_url: string
  link_externo: string
}

type Props = {
  evento: Evento
  onCerrar: () => void
  onGuardado: () => void
}

export default function EditarEvento({ evento, onCerrar, onGuardado }: Props) {
  const [nombre, setNombre] = useState(evento.nombre)
  const [tipos, setTipos] = useState<string[]>(evento.tipo ? evento.tipo.split(', ') : [])
  const [descripcion, setDescripcion] = useState(evento.descripcion || '')
  const [direccion, setDireccion] = useState(evento.direccion)
  const [fechaInicio, setFechaInicio] = useState(evento.fecha_inicio ? evento.fecha_inicio.slice(0, 16) : '')
  const [fechaFin, setFechaFin] = useState(evento.fecha_fin ? evento.fecha_fin.slice(0, 16) : '')
  const [linkExterno, setLinkExterno] = useState(evento.link_externo || '')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  function toggleTipo(key: string) {
    setTipos(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    )
  }

  async function handleGuardar() {
    if (!nombre || tipos.length === 0 || !direccion || !fechaInicio) {
      alert('Por favor completa los campos obligatorios')
      return
    }
    setCargando(true)

    const { error } = await supabase
      .from('eventos')
      .update({
        nombre,
        tipo: tipos.join(', '),
        descripcion,
        direccion,
        fecha_inicio: fechaInicio,
        link_externo: linkExterno || null,
      })
      .eq('id', evento.id)

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
        <div style={{ background: '#FCD34D', padding: '16px', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Editar evento</div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 16, color: '#16a34a', fontWeight: 600 }}>
              Evento actualizado exitosamente
            </div>
          ) : (
            <>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Nombre del evento *"
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
              />

              <div style={{ fontSize: 12, color: '#777' }}>Tipo de evento</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {TIPOS_EVENTO.map(t => (
                  <button
                    key={t.key}
                    onClick={() => toggleTipo(t.key)}
                    style={{
                      border: `1.5px solid ${tipos.includes(t.key) ? '#FCD34D' : '#d1d5db'}`,
                      borderRadius: 12, padding: '10px 8px', fontSize: 12, cursor: 'pointer',
                      color: '#111', background: tipos.includes(t.key) ? '#FCD34D' : '#fff',
                      fontWeight: tipos.includes(t.key) ? 600 : 400,
                    }}
                  >
                    {t.emoji} {t.key}
                  </button>
                ))}
              </div>

              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Descripcion (opcional)"
                rows={3}
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none', resize: 'none' }}
              />

              <div>
                <div style={{ fontSize: 12, color: '#777', marginBottom: 4 }}>Fecha y hora de inicio *</div>
                <input
                  type="datetime-local"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, color: '#777', marginBottom: 4 }}>Fecha y hora de fin (opcional)</div>
                <input
                  type="datetime-local"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
                />
              </div>

              <input
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                placeholder="Direccion del evento *"
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
              />

              <input
                value={linkExterno}
                onChange={e => setLinkExterno(e.target.value)}
                placeholder="Link oficial del evento (opcional)"
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
              />
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