'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

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
const ClickHandlerDynamic = dynamic(
  () => import('./ClickHandler'),
  { ssr: false }
)
const CentroHandler = dynamic(
  () => import('./CentroHandler'),
  { ssr: false }
)

type Props = {
  onUbicacionSeleccionada: (lat: number, lng: number) => void
  centro?: [number, number]
  pinInicial?: { lat: number; lng: number } | null
}

export default function MapSelector({ onUbicacionSeleccionada, centro, pinInicial }: Props) {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(pinInicial || null)

  function handleClic(lat: number, lng: number) {
    setPin({ lat, lng })
    onUbicacionSeleccionada(lat, lng)
  }

  useEffect(() => {
    if (pinInicial) setPin(pinInicial)
  }, [pinInicial])

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid #6ee7b7', height: 180, position: 'relative' }}>
      <MapContainer
        center={[19.4326, -99.1332]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <ClickHandlerDynamic onClic={handleClic} />
        <CentroHandler centro={centro} />
        {pin && <Marker position={[pin.lat, pin.lng]} />}
      </MapContainer>
      {!pin && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 999
        }}>
          <span style={{ background: 'white', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#065f46', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            👆 Toca el mapa para marcar
          </span>
        </div>
      )}
    </div>
  )
}