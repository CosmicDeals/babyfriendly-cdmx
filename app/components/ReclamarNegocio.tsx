'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

type Props = {
  lugarId: string
  nombreLugar: string
  onCerrar: () => void
}

export default function ReclamarNegocio({ lugarId, nombreLugar, onCerrar }: Props) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  async function handleEnviar() {
    if (!nombre || !correo) {
      alert('Por favor llena tu nombre y correo')
      return
    }
    setCargando(true)

    const { error } = await supabase
      .from('reclamaciones')
      .insert([{
        lugar_id: lugarId,
        nombre_contacto: nombre,
        correo_contacto: correo,
        mensaje,
      }])

    if (error) {
      alert('Hubo un error al enviar la solicitud')
      setCargando(false)
      return
    }

    setCargando(false)
    setExito(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 380, margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#FCD34D', padding: '16px', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>🏪 Reclamar negocio</div>
          <div style={{ fontSize: 12, color: '#111', opacity: 0.7, marginTop: 4 }}>{nombreLugar}</div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>¡Solicitud enviada!</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                Nos pondremos en contacto contigo en los próximos días para verificar y actualizar la información de tu negocio.
              </div>
              <button
                onClick={onCerrar}
                style={{ marginTop: 20, border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 13, fontWeight: 700, color: '#111', background: '#FCD34D', cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, background: '#FFFBEB', borderRadius: 12, padding: '10px 14px' }}>
                ¿Eres el dueño o administrador de este lugar? Contáctanos para verificar y actualizar la información de tu negocio. Tu ficha aparecerá con una insignia ✅ de verificado.
              </div>

              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre *"
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
              />

              <input
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="Tu correo *"
                type="email"
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
              />

              <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder="Mensaje adicional (opcional) — ej: horarios, redes sociales, etc."
                rows={3}
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none', resize: 'none' }}
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
              onClick={handleEnviar}
              disabled={cargando}
              style={{ flex: 2, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, color: '#111', background: cargando ? '#FEF08A' : '#FCD34D', cursor: 'pointer' }}
            >
              {cargando ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}