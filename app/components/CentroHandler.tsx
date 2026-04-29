'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export default function CentroHandler({ centro }: { centro?: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    if (centro) {
      map.setView(centro, 16)
    }
  }, [centro])

  return null
}