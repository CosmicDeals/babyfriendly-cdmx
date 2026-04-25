'use client'

import { LeafletMouseEvent } from 'leaflet'
import { useMapEvents } from 'react-leaflet'

export default function ClickHandler({ onClic }: { onClic: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onClic(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}