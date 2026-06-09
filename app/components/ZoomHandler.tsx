'use client'

import { useMapEvents } from 'react-leaflet'

export default function ZoomHandler({ onBoundsChange }: { onBoundsChange: (bounds: any) => void }) {
  useMapEvents({
    moveend(e) {
      onBoundsChange(e.target.getBounds())
    },
    zoomend(e) {
      onBoundsChange(e.target.getBounds())
    },
  })

  return null
}