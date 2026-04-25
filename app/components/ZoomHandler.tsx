'use client'

import { useEffect } from 'react'
import { useMapEvents } from 'react-leaflet'

export default function ZoomHandler({ onBoundsChange }: { onBoundsChange: (bounds: any) => void }) {
  const map = useMapEvents({
    moveend() {
      onBoundsChange(map.getBounds())
    },
    zoomend() {
      onBoundsChange(map.getBounds())
    },
  })

  useEffect(() => {
    onBoundsChange(map.getBounds())
  }, [])

  return null
}