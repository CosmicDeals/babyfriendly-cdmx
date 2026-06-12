'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import FormularioLugar from './FormularioLugar'
import EditarInstalaciones from './EditarInstalaciones'
import Buscador from './Buscador'
import Filtros from './Filtros'
import ReportarLugar from './ReportarLugar'
import ListaResultados from './ListaResultados'
import ReclamarNegocio from './ReclamarNegocio'

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
const ZoomHandler = dynamic(
  () => import('./ZoomHandler'),
  { ssr: false }
)

type Lugar = {
  id: string
  nombre: string
  tipo: string
  direccion: string
  latitud: number
  longitud: number
  instalaciones?: any[]
  actualizado_en?: string
  creado_en?: string
  detalles?: string
}

export default function Map() {
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [lugarEditando, setLugarEditando] = useState<Lugar | null>(null)
  const [lugarReportando, setLugarReportando] = useState<Lugar | null>(null)
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([])
  const [bounds, setBounds] = useState<any>(null)
  const mapRef = useRef<any>(null)
  const [mostrarAbout, setMostrarAbout] = useState(false)
  const [tiposActivos, setTiposActivos] = useState<string[]>([])
  const [lugarSeleccionado, setLugarSeleccionado] = useState<any>(null)
  const [lugarReclamando, setLugarReclamando] = useState<Lugar | null>(null)
  const [lugaresBuscados, setLugaresBuscados] = useState<Lugar[]>([])

  async function cargarLugares() {
    const { data, error } = await supabase
      .from('lugares')
      .select('*, instalaciones(*)')
    if (error) {
      console.error('Error cargando lugares:', JSON.stringify(error))
      return
    }
    if (data) setLugares(data)
  }

  useEffect(() => {
    cargarLugares()
  }, [])

  const handleEditarLugar = useCallback((lugar: Lugar) => {
    setLugarEditando(lugar)
  }, [])

  function toggleFiltro(key: string) {
    setFiltrosActivos(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    )
  }
  function toggleTipo(key: string) {
    setTiposActivos(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    )
  }
  function handleUbicacion(lat: number, lng: number, zoom: number) {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], zoom)
    }
  }

  function handleGeolocalizacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (mapRef.current) {
            mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 15)
          }
        },
        () => alert('No pudimos obtener tu ubicación')
      )
    }
  }

 const lugaresFiltrados = lugares.filter(lugar => {
  if (bounds) {
    const { _southWest: sw, _northEast: ne } = bounds
    if (
      lugar.latitud < sw.lat || lugar.latitud > ne.lat ||
      lugar.longitud < sw.lng || lugar.longitud > ne.lng
    ) return false
  }

  if (tiposActivos.length > 0 && !tiposActivos.includes(lugar.tipo)) return false

  if (filtrosActivos.length === 0) return true

  const inst = lugar.instalaciones?.[0]
  if (!inst) return false
  return filtrosActivos.every(f => inst[f] === true)
})

  const iconoEstrella = typeof window !== 'undefined'
    ? require('leaflet').divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:#FCD34D;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
iconSize: [16, 16],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      })
    : null

  return (
    <>
      {/* Barra superior */}
      <div className="barra-superior" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#fff', padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Buscador 
  onUbicacion={handleUbicacion}
  onLugaresEncontrados={(lugares) => {
    if (lugares.length > 0) {
      mapRef.current?.setView([lugares[0].latitud, lugares[0].longitud], 15)
      setLugaresBuscados(lugares)
    } else {
      setLugaresBuscados([])
    }
  }}
/>
        <div style={{ marginTop: 8 }}>
          <Filtros 
            filtrosActivos={filtrosActivos} 
            onToggle={toggleFiltro}
            tiposActivos={tiposActivos}
            onToggleTipo={toggleTipo}
            />
        </div>
        {filtrosActivos.length > 0 && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#111', fontWeight: 500 }}>
            {lugaresFiltrados.length} lugar{lugaresFiltrados.length !== 1 ? 'es' : ''} encontrado{lugaresFiltrados.length !== 1 ? 's' : ''} en tu zona
          </div>
        )}
      </div>

      {/* Mapa */}
      <div style={{ paddingTop: 110, width: '100%', height: '100vh' }}>
        <MapContainer
          center={[19.4326, -99.1332]}
          zoom={13}
          style={{ height: 'calc(100vh - 110px)', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ZoomHandler onBoundsChange={useCallback(setBounds, [])} />
          {lugaresFiltrados.map(lugar => (
            <Marker
              key={lugar.id}
              position={[lugar.latitud, lugar.longitud]}
              icon={iconoEstrella || undefined}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 2 }}>{lugar.nombre}</div>
                  <div style={{ fontSize: 12, color: '#111', marginBottom: 6 }}>{lugar.tipo}</div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>{lugar.direccion}</div>
                 <a href={`https://www.google.com/maps?q=${lugar.latitud},${lugar.longitud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginBottom: 6 }}
                >
                  &#x1F4CD; Obtener direcciones en Google Maps
                </a>
                  {lugar.detalles && (
                  <div style={{ fontSize: 11, color: '#888' }}>{lugar.detalles}</div>
                )}
                  {lugar.instalaciones?.[0] && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {lugar.instalaciones[0].cambiador_bebe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F6BC;</span><span style={{ color: '#111' }}>Cambiador</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].sillas_bebe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1FA91;</span><span style={{ color: '#111' }}>Silla bebé</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].lactario && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F931;</span><span style={{ color: '#111' }}>Lactario</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].area_juegos && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F6DD;</span><span style={{ color: '#111' }}>Área juegos</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].nineras && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F9D1;&#x200D;&#x1F467;</span><span style={{ color: '#111' }}>Niñeras</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].menu_infantil && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F37D;</span><span style={{ color: '#111' }}>Menú infantil</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].accesibilidad && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x267F;</span><span style={{ color: '#111' }}>Accesibilidad</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].estacionamiento_accesible && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F17F;</span><span style={{ color: '#111' }}>Estacionamiento</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].pet_friendly && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                        <span>🐾</span><span style={{ color: '#B45309' }}>Pet friendly</span>
                      </div>
                    )}
                    </div>
                  )}
                  <button
                    onClick={() => handleEditarLugar(lugar)}
                    style={{ width: '100%', border: 'none', borderRadius: 8, padding: '6px 0', fontSize: 12, fontWeight: 600, color: '#111', background: '#FCD34D', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 10, color: '#aaa', marginBottom: 6 }}>
  {lugar.actualizado_en
    ? `Actualizado: ${new Date(lugar.actualizado_en).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : lugar.creado_en
    ? `Agregado: ${new Date(lugar.creado_en).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : ''}
</div> 
                    Editar
                  </button>
                  <button
                    onClick={() => setLugarReportando(lugar)}
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 8, padding: '6px 0', fontSize: 12, fontWeight: 600, color: '#6b7280', background: '#fff', cursor: 'pointer' }}
                  >
                    🚩 Reportar Error
                  </button>

                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Botones flotantes */}
      <button
        onClick={() => setMostrarFormulario(true)}
        className="boton-agregar"
      >
        + Agregar lugar
      </button>

      <button
        onClick={handleGeolocalizacion}
        style={{
          position: 'fixed',
          bottom: '8rem',
          right: '1rem',
          zIndex: 99999,
          background: '#FCD34D',
          border: '2px solid #FCD34D',
          borderRadius: '9999px',
          width: 44,
          height: 44,
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          touchAction: 'manipulation',
        }}
      >
        &#x1F4CD;
      </button>

      {/* Modales */}
      {mostrarFormulario && (
        <FormularioLugar
          onCerrar={() => {
            setMostrarFormulario(false)
            cargarLugares()
          }}
        />
      )}

      {lugarEditando && (
  <EditarInstalaciones
    lugarId={lugarEditando.id}
    nombreLugar={lugarEditando.nombre}
    instalacionesActuales={lugarEditando.instalaciones?.[0] || {}}
    latitudActual={lugarEditando.latitud}
    longitudActual={lugarEditando.longitud}
    onCerrar={() => setLugarEditando(null)}
    onGuardado={() => {
      setLugarEditando(null)
      cargarLugares()
    }}
  />
)}
      
      {lugarReportando && (
  <ReportarLugar
    lugarId={lugarReportando.id}
    nombreLugar={lugarReportando.nombre}
    onCerrar={() => setLugarReportando(null)}
  />
)}
<a href="/eventos"
  style={{
    position: 'fixed',
    bottom: '4rem',
    left: '1rem',
    zIndex: 9999,
    background: '#FCD34D',
    border: 'none',
    borderRadius: 9999,
    padding: '8px 14px',
    fontSize: 14,
    fontWeight: 700,
    color: '#111',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }}
>
  Eventos
</a>
    {/* Botón About + Ko-fi */}
      <div style={{ position: 'fixed', bottom: '0.5rem', left: '1rem', zIndex: 9999 }}>
  <div
    onClick={() => setMostrarAbout(!mostrarAbout)}
    style={{ background: 'white', border: '1.5px solid #f3f4f6', borderRadius: 9999, padding: '8px 14px', fontSize: 12, color: '#555', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}
  >
    ℹ️ Sobre este proyecto
  </div>
  {mostrarAbout && (
    <div style={{ position: 'absolute', bottom: 44, left: 0, width: 240, background: 'white', borderRadius: 16, padding: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Sobre este proyecto</span>
        <span onClick={() => setMostrarAbout(false)} style={{ cursor: 'pointer', fontSize: 16, color: '#aaa', lineHeight: 1 }}>✕</span>
      </div>
      <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>
        Porque moverte con tus hijos no debería ser complicado. <strong>Esta plataforma es gratuita y hecha en comunidad.</strong> Si te es útil, considera apoyarnos.
      </p>
      <a href="https://ko-fi.com/pequemaps" target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#FCD34D', color: '#111', border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
        ☕ Apóyanos en Ko-fi
      </a>
      <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 5, textAlign: 'center', marginTop: 15, padding: '3px 10px', border: '2px solid #309ad7', borderRadius: 4, background: '#f3f4f6', boxShadow: '0 0 0 1px #fc4dd0, inset 0 0 0 1px #FEF9C3, 2px 2px 0px #d7b030', }}>
        Sugerencias o feedback: <a href="mailto:pau@pequemaps.com" style={{ color: '#111', fontWeight: 700 }}>pau@pequemaps.com</a>
      </div>
    </div>
  )}
</div>
{/* Lista de resultados */}
{(filtrosActivos.length > 0 || tiposActivos.length > 0 || lugaresBuscados.length > 0) && (
  <ListaResultados
    lugares={lugaresBuscados.length > 0 ? lugaresBuscados : lugaresFiltrados}
    onSeleccionar={(lugar) => {
      if (mapRef.current) {
        mapRef.current.setView([lugar.latitud, lugar.longitud], 16)
      setLugarSeleccionado(lugar)
      }
    }}
    onCerrar={() => {
  setLugaresBuscados([])
  setFiltrosActivos([])
  setTiposActivos([])
}}
  />
)}
{lugarSeleccionado && (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  }} onClick={() => setLugarSeleccionado(null)}>
    <div style={{
      background: '#fff',
      borderRadius: '20px 20px 0 0',
      padding: '20px 16px',
      width: '100%',
      maxWidth: 480,
    }} onClick={e => e.stopPropagation()}>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 4 }}>{lugarSeleccionado.nombre}</div>
      <div style={{ fontSize: 13, color: '#FCD34D', marginBottom: 6, fontWeight: 500 }}>{lugarSeleccionado.tipo}</div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{lugarSeleccionado.direccion}</div>

 <a href={`https://www.google.com/maps?q=${lugarSeleccionado.latitud},${lugarSeleccionado.longitud}`}
  target="_blank"
  rel="noopener noreferrer"
  style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'block', marginBottom: 12}}
>
  &#x1F4CD; Obtener direcciones en Google Maps
</a>
      {lugarSeleccionado.instalaciones?.[0] && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {lugarSeleccionado.instalaciones[0].cambiador_bebe && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>🚼</span><span style={{ color: '#B45309' }}>Cambiador</span></div>}
          {lugarSeleccionado.instalaciones[0].sillas_bebe && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>🪑</span><span style={{ color: '#B45309' }}>Silla bebé</span></div>}
          {lugarSeleccionado.instalaciones[0].lactario && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>🤱</span><span style={{ color: '#B45309' }}>Lactario</span></div>}
          {lugarSeleccionado.instalaciones[0].area_juegos && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>🎠</span><span style={{ color: '#B45309' }}>Área juegos</span></div>}
          {lugarSeleccionado.instalaciones[0].nineras && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>👧</span><span style={{ color: '#B45309' }}>Niñeras</span></div>}
          {lugarSeleccionado.instalaciones[0].menu_infantil && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>🍽</span><span style={{ color: '#B45309' }}>Menú infantil</span></div>}
          {lugarSeleccionado.instalaciones[0].accesibilidad && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>♿</span><span style={{ color: '#B45309' }}>Accesibilidad</span></div>}
          {lugarSeleccionado.instalaciones[0].estacionamiento_accesible && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>🅿</span><span style={{ color: '#B45309' }}>Estacionamiento</span></div>}
          {lugarSeleccionado.instalaciones[0].pet_friendly && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}><span>🐾</span><span style={{ color: '#B45309' }}>Pet friendly</span></div>}
        </div>
      )}
      {lugarSeleccionado.detalles && (
  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{lugarSeleccionado.detalles}</div>
)}
      <a href={`https://wa.me/?text=${encodeURIComponent(`¡Encontré este lugar kid friendly en PequeMaps! 🌟\n\n*${lugarSeleccionado.nombre}*\n📍 ${lugarSeleccionado.direccion}\n\nEncuéntralo en: https://pequemaps.com`)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', background: '#25D366', color: 'white', border: 'none', borderRadius: 12, padding: '10px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', marginBottom: 8 }}
      >
  Compartir por WhatsApp
</a>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => { handleEditarLugar(lugarSeleccionado); setLugarSeleccionado(null) }}
          style={{ flex: 2, border: 'none', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 700, color: '#111', background: '#FCD34D', cursor: 'pointer' }}
        >
          Editar
        </button>
        <button
          onClick={() => { setLugarReportando(lugarSeleccionado); setLugarSeleccionado(null) }}
          style={{ flex: 1, border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 600, color: '#666', background: '#fff', cursor: 'pointer' }}
        >
          🚩 Reportar Error
        </button>
      </div>
      <button
        onClick={() => setLugarSeleccionado(null)}
        style={{ width: '100%', border: 'none', borderRadius: 12, padding: 10, fontSize: 13, color: '#aaa', background: 'transparent', cursor: 'pointer', marginTop: 8 }}
      >
        Cerrar
      </button>
      <button
  onClick={() => { setLugarReclamando(lugarSeleccionado); setLugarSeleccionado(null) }}
  style={{ width: '100%', border: '1.5px solid #FCD34D', borderRadius: 12, padding: 10, fontSize: 13, fontWeight: 600, color: '#111', background: '#FFFBEB', cursor: 'pointer', marginTop: 6 }}
>
  🏪 ¿Eres el dueño? Reclama tu negocio
</button>
    </div>
  </div>
)}
{lugarReclamando && (
  <ReclamarNegocio
    lugarId={lugarReclamando.id}
    nombreLugar={lugarReclamando.nombre}
    onCerrar={() => setLugarReclamando(null)}
  />
)}
    </>
  )
}