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

export default function FormularioEvento({ onCerrar }: { onCerrar: () => void }) {
  const [paso, setPaso] = useState(1)
  const [nombre, setNombre] = useState('')
  const [tipos, setTipos] = useState<string[]>([])
  const [descripcion, setDescripcion] = useState('')
  const [direccion, setDireccion] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [linkExterno, setLinkExterno] = useState('')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  function toggleTipoEvento(key: string) {
  setTipos(prev =>
    prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
  )
}
async function handleSubirImagen(file: File) {
  setSubiendoImagen(true)
  const nombreArchivo = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('eventos-imagenes')
    .upload(nombreArchivo, file)

  if (error) {
    alert('Error al subir la imagen')
    setSubiendoImagen(false)
    return
  }

  const { data: urlData } = supabase.storage
    .from('eventos-imagenes')
    .getPublicUrl(nombreArchivo)

  setImagenUrl(urlData.publicUrl)
  setSubiendoImagen(false)
}
  async function handleSubmit() {
    if (!nombre || !tipos.join || !direccion || !fechaInicio) {
      alert('Por favor completa los campos obligatorios')
      return
    }
    setCargando(true)

    const { error } = await supabase.from('eventos').insert([{
      nombre,
      tipo: tipos.join(', '),
      descripcion,
      direccion,
      fecha_inicio: new Date(fechaInicio).toISOString(),
      fecha_fin: fechaFin ? new Date(fechaFin).toISOString() : null,
      imagen_url: imagenUrl || null,
      link_externo: linkExterno || null,
    }])

    if (error) {
      alert('Hubo un error al guardar el evento')
      setCargando(false)
      return
    }

    setCargando(false)
    setExito(true)
    setTimeout(() => onCerrar(), 2000)
  }

  const progreso = (paso / 3) * 100

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 380, margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#FCD34D', padding: '16px', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>🎉 Agregar evento</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: paso >= n ? '#111' : 'rgba(0,0,0,0.2)' }} />
            ))}
          </div>
        </div>

        {/* Barra progreso */}
        <div style={{ height: 4, background: '#FEF9C3' }}>
          <div style={{ height: '100%', background: '#FCD34D', width: `${progreso}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 16px' }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 18, color: '#16a34a', fontWeight: 600 }}>
              🎉 ¡Evento agregado!
            </div>
          ) : (
            <>
              {/* Paso 1 — Qué es */}
              {paso === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>¿Qué evento es? 🎪</div>
                  <input
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Nombre del evento*"
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
                  />
                  <div style={{ fontSize: 12, color: '#777' }}>Tipo de evento (puedes seleccionar varios)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {TIPOS_EVENTO.map(t => (
                        <button
                            key={t.key}
                            onClick={() => toggleTipoEvento(t.key)}
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
                    placeholder="Descripción (opcional)"
                    rows={3}
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none', resize: 'none' }}
                  />
                </div>
              )}

              {/* Paso 2 — Cuándo y dónde */}
              {paso === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>¿Cuándo y dónde? 📅</div>
                  <div>
                    <div style={{ fontSize: 12, color: '#777', marginBottom: 4 }}>Fecha y hora de inicio *</div>
                    <input
                        type="datetime-local"
                        value={fechaInicio}
                        onChange={e => setFechaInicio(e.target.value)}
                        step="300"
                        style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#777', marginBottom: 4 }}>Fecha y hora de fin (opcional)</div>
                    <input
                      type="datetime-local"
                      value={fechaFin}
                      onChange={e => setFechaFin(e.target.value)}
                      step="300"
                      style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
                    />
                  </div>
                  <input
                    value={direccion}
                    onChange={e => setDireccion(e.target.value)}
                    placeholder="Dirección del evento *"
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
                  />
                </div>
              )}

              {/* Paso 3 */}
              {paso === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Imagen y mas info</div>
                  <div style={{ fontSize: 12, color: '#777' }}>Opcional pero recomendado</div>
                  <div>
                    <div style={{ fontSize: 12, color: '#777', marginBottom: 4 }}>Imagen del evento (opcional)</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        if (e.target.files?.[0]) handleSubirImagen(e.target.files[0])
                      }}
                      style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
                    />
                    {subiendoImagen && (
                      <div style={{ fontSize: 12, color: '#B45309', marginTop: 4 }}>Subiendo imagen...</div>
                    )}
                    {imagenUrl && !subiendoImagen && (
                      <img src={imagenUrl} alt="Preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginTop: 8 }} />
                    )}
                  </div>
                  <input
                    value={linkExterno}
                    onChange={e => setLinkExterno(e.target.value)}
                    placeholder="Link oficial del evento (opcional)"
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none' }}
                  />
                  <div style={{ background: '#FFFBEB', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#B45309' }}>
                    Puedes subir un screenshot o foto del evento directamente desde tu telefono
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
              style={{ flex: 2, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, color: '#111', background: cargando ? '#FEF08A' : '#FCD34D', cursor: 'pointer' }}
            >
              {paso < 3 ? 'Siguiente →' : cargando ? 'Guardando...' : '✓ Agregar evento'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}