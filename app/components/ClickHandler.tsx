'use client'

import { useMapEvents } from 'react-leaflet'

export default function ClickHandler({ onClic }: { onClic: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClic(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}