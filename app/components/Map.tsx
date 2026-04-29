'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import FormularioLugar from './FormularioLugar'
import EditarInstalaciones from './EditarInstalaciones'
import Buscador from './Buscador'
import Filtros from './Filtros'
import ReportarLugar from './ReportarLugar'

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
}

export default function Map() {
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [lugarEditando, setLugarEditando] = useState<Lugar | null>(null)
  const [lugarReportando, setLugarReportando] = useState<Lugar | null>(null)
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([])
  const [bounds, setBounds] = useState<any>(null)
  const mapRef = useRef<any>(null)

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
    if (filtrosActivos.length === 0) return true
    const inst = lugar.instalaciones?.[0]
    if (!inst) return false
    return filtrosActivos.every(f => inst[f] === true)
  })

  const iconoEstrella = typeof window !== 'undefined'
    ? require('leaflet').divIcon({
        className: '',
        html: `<div style="font-size:28px;line-height:1;color:#ec4899;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">★</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      })
    : null

  return (
    <>
      {/* Barra superior */}
      <div className="barra-superior" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#fff', padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Buscador onUbicacion={handleUbicacion} />
        <div style={{ marginTop: 8 }}>
          <Filtros filtrosActivos={filtrosActivos} onToggle={toggleFiltro} />
        </div>
        {filtrosActivos.length > 0 && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#be185d', fontWeight: 500 }}>
            {lugaresFiltrados.length} lugar{lugaresFiltrados.length !== 1 ? 'es' : ''} encontrado{lugaresFiltrados.length !== 1 ? 's' : ''}
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
          <ZoomHandler onBoundsChange={setBounds} />
          {lugaresFiltrados.map(lugar => (
            <Marker
              key={lugar.id}
              position={[lugar.latitud, lugar.longitud]}
              icon={iconoEstrella || undefined}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 2 }}>{lugar.nombre}</div>
                  <div style={{ fontSize: 12, color: '#ec4899', marginBottom: 6 }}>{lugar.tipo}</div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>{lugar.direccion}</div>
                  {lugar.instalaciones?.[0] && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {lugar.instalaciones[0].cambiador_bebe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F6BC;</span><span style={{ color: '#be185d' }}>Cambiador</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].sillas_bebe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1FA91;</span><span style={{ color: '#be185d' }}>Silla bebé</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].lactario && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F931;</span><span style={{ color: '#be185d' }}>Lactario</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].area_juegos && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F6DD;</span><span style={{ color: '#be185d' }}>Área juegos</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].nineras && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F9D1;&#x200D;&#x1F467;</span><span style={{ color: '#be185d' }}>Niñeras</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].menu_infantil && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F37D;</span><span style={{ color: '#be185d' }}>Menú infantil</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].accesibilidad && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x267F;</span><span style={{ color: '#be185d' }}>Accesibilidad</span>
                        </div>
                      )}
                      {lugar.instalaciones[0].estacionamiento_accesible && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', borderRadius: 8, padding: '3px 7px', fontSize: 11 }}>
                          <span>&#x1F17F;</span><span style={{ color: '#be185d' }}>Estacionamiento</span>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => handleEditarLugar(lugar)}
                    style={{ width: '100%', border: 'none', borderRadius: 8, padding: '6px 0', fontSize: 12, fontWeight: 600, color: '#fff', background: '#ec4899', cursor: 'pointer' }}
                  >
                    Editar instalaciones
                  </button>
                  <button
                    onClick={() => setLugarReportando(lugar)}
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 8, padding: '6px 0', fontSize: 12, fontWeight: 600, color: '#6b7280', background: '#fff', cursor: 'pointer' }}
                  >
                    🚩 Reportar lugar
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
          background: '#fff',
          border: '2px solid #ec4899',
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
          instalacionesActuales={lugarEditando.instalaciones?.[0] || {}}
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
    </>
  )
}