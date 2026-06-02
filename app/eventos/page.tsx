'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import FormularioEvento from '../components/FormularioEvento'
import EditarEvento from '../components/EditarEvento'

const TIPOS_EVENTO = [
  { key: 'Teatro', emoji: '🎭' },
  { key: 'Festival', emoji: '🎪' },
  { key: 'Música', emoji: '🎵' },
  { key: 'Deporte', emoji: '⚽' },
  { key: 'Arte', emoji: '🎨' },
  { key: 'Cine', emoji: '🎬' },
  { key: 'Naturaleza', emoji: '🌿' },
  { key: 'Educativo', emoji: '📚' },
  { key: 'Ciencia', emoji: '📚' },
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

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [filtro, setFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null)
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  async function cargarEventos() {
  const hoy = new Date().toISOString()
  const { data, error } = await supabase
  .from('eventos')
  .select('*')
  .eq('activo', true)
  .or(`fecha_fin.gte.${hoy},fecha_fin.is.null`)
  .gte('fecha_inicio', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
  .order('fecha_inicio', { ascending: true })

    if (!error && data) setEventos(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarEventos()
  }, [])

  const eventosFiltrados = eventos.filter(e => {
    const coincideTipo = filtro ? e.tipo.includes(filtro) : true
    const coincideBusqueda = busqueda
      ? e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.tipo.toLowerCase().includes(busqueda.toLowerCase())
      : true
    return coincideTipo && coincideBusqueda
  })

  function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEB', fontFamily: '-apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#FCD34D', padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="/" style={{ color: '#111', textDecoration: 'none', fontSize: 20 }}>←</a>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#60320e' }}>🎉 Eventos para peques en CDMX</div>
          <div style={{ fontSize: 15, color: '#111', opacity: 0.7 }}>Busca o agrega eventos en CDMX</div>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          style={{ border: 'none', borderRadius: 20, padding: '8px 14px', background: '#60320e', color: '#FCD34D', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          + Agregar
        </button>
      </div>

      {/* Buscador */}
      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Busca un evento..."
          style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 20, padding: '8px 14px', fontSize: 16, color: '#111', background: '#fff', outline: 'none' }}
        />
      </div>

      {/* Filtros por tipo */}
      <div style={{ padding: '10px 16px', background: '#fff', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button
          onClick={() => setFiltro('')}
          style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${filtro === '' ? '#FCD34D' : '#e5e7eb'}`, background: filtro === '' ? '#FCD34D' : '#fff', color: '#111', fontSize: 11, fontWeight: filtro === '' ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Todos
        </button>
        {TIPOS_EVENTO.map(t => (
          <button
            key={t.key}
            onClick={() => setFiltro(filtro === t.key ? '' : t.key)}
            style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${filtro === t.key ? '#FCD34D' : '#e5e7eb'}`, background: filtro === t.key ? '#FCD34D' : '#fff', color: '#111', fontSize: 11, fontWeight: filtro === t.key ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {t.emoji} {t.key}
          </button>
        ))}
      </div>

      {/* Lista de eventos */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>Cargando eventos...</div>
        ) : eventosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎪</div>
            <div>No hay eventos próximos</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>¡Sé el primero en agregar uno!</div>
          </div>
        ) : (
          eventosFiltrados.map(evento => (
            <div key={evento.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {evento.imagen_url && (
                <img src={evento.imagen_url} alt={evento.nombre} style={{ width: '100%', height: 180, objectFit: 'cover', cursor: 'pointer' }} 
                onClick={() => setImagenAmpliada(evento.imagen_url)} />
              )}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111', flex: 1 }}>{evento.nombre}</div>
                  <div style={{ fontSize: 11, color: '#111', background: '#FCD34D', padding: '2px 8px', borderRadius: 20, marginLeft: 8, whiteSpace: 'nowrap' }}>{evento.tipo}</div>
                </div>
                <div style={{ fontSize: 12, color: '#FCD34D', fontWeight: 600, marginBottom: 4 }}>
                  📅 {formatearFecha(evento.fecha_inicio)}
                  {evento.fecha_fin && ` — ${formatearFecha(evento.fecha_fin)}`}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>📍 {evento.direccion}</div>
                {evento.descripcion && (
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>{evento.descripcion}</div>
                )}
                {evento.link_externo && (
                  
                   <a href={evento.link_externo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', background: '#111', color: '#FCD34D', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}
                  >
                    
                    Ver más →
                  </a>
                  
                )}
                <button
  onClick={() => setEventoEditando(evento)}
  style={{ display: 'inline-block', background: '#f3f4f6', color: '#555', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', marginLeft: evento.link_externo ? 8 : 0 }}
>
  Editar
</button>
              </div>
            </div>
          ))
        )}
      </div>
      {imagenAmpliada && (
  <div
    onClick={() => setImagenAmpliada(null)}
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
  >
    <button
      onClick={() => setImagenAmpliada(null)}
      style={{ position: 'absolute', top: 16, right: 16, background: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      ✕
    </button>
    <img
      src={imagenAmpliada}
      alt="Imagen del evento"
      style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }}
      onClick={e => e.stopPropagation()}
    />
  </div>
)}
      {eventoEditando && (
  <EditarEvento
    evento={eventoEditando}
    onCerrar={() => setEventoEditando(null)}
    onGuardado={() => {
      setEventoEditando(null)
      cargarEventos()
    }}
  />
)}

      {mostrarFormulario && (
        <FormularioEvento
          onCerrar={() => {
            setMostrarFormulario(false)
            cargarEventos()
          }}
        />
      )}
    </div>
  )
}