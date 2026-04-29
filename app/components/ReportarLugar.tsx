'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const MOTIVOS = [
  { key: 'cerrado', label: '🔒 El lugar cerró permanentemente' },
  { key: 'incorrecto', label: '📍 La ubicación es incorrecta' },
  { key: 'informacion', label: '❌ La información es incorrecta' },
  { key: 'duplicado', label: '♻️ Es un lugar duplicado' },
  { key: 'otro', label: '💬 Otro motivo' },
]

type Props = {
  lugarId: string
  nombreLugar: string
  onCerrar: () => void
}

export default function ReportarLugar({ lugarId, nombreLugar, onCerrar }: Props) {
  const [motivo, setMotivo] = useState('')
  const [comentario, setComentario] = useState('')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  async function handleEnviar() {
    if (!motivo) {
      alert('Por favor selecciona un motivo')
      return
    }
    setCargando(true)

    const { error } = await supabase
      .from('reportes')
      .insert([{
        lugar_id: lugarId,
        motivo,
        comentario
      }])

    if (error) {
      alert('Hubo un error al enviar el reporte')
      setCargando(false)
      return
    }

    setCargando(false)
    setExito(true)
    setTimeout(() => onCerrar(), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 380, margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#6b7280', padding: '16px', color: 'white', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>🚩 Reportar lugar</div>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>{nombreLugar}</div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 16px' }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 16, color: '#16a34a', fontWeight: 600 }}>
              ✅ ¡Reporte enviado!<br />
              <span style={{ fontSize: 13, fontWeight: 400, color: '#666' }}>Lo revisaremos pronto</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, color: '#777', marginBottom: 4 }}>¿Cuál es el motivo del reporte?</div>
              {MOTIVOS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMotivo(m.key)}
                  style={{
                    border: `1.5px solid ${motivo === m.key ? '#6b7280' : '#d1d5db'}`,
                    borderRadius: 12,
                    padding: '10px 14px',
                    fontSize: 13,
                    cursor: 'pointer',
                    color: motivo === m.key ? '#fff' : '#444',
                    background: motivo === m.key ? '#6b7280' : '#fff',
                    fontWeight: motivo === m.key ? 600 : 400,
                    textAlign: 'left',
                  }}
                >
                  {m.label}
                </button>
              ))}
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Comentario adicional (opcional)"
                rows={3}
                style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: '11px 13px', fontSize: 14, color: '#111', background: '#fff', outline: 'none', resize: 'none', marginTop: 4 }}
              />
            </div>
          )}
        </div>

        {/* Botones */}
        {!exito && (
          <div style={{ padding: '14px 16px', borderTop: '2px solid #f3f4f6', display: 'flex', gap: 10 }}>
            <button
              onClick={onCerrar}
              style={{ flex: 1, border: 'none', borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 700, color: '#fff', background: '#ec4899', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              disabled={cargando}
              style={{ flex: 2, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, color: '#fff', background: cargando ? '#9ca3af' : '#6b7280', cursor: 'pointer' }}
            >
              {cargando ? 'Enviando...' : '🚩 Enviar reporte'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
