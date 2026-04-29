'use client'

import { useState } from 'react'
import Map from './components/Map'
import SplashScreen from './components/SplashScreen'

export default function Home() {
  const [mostrarMapa, setMostrarMapa] = useState(false)

  return (
    <main className="w-full h-screen">
      {!mostrarMapa && (
        <SplashScreen onEntrar={() => setMostrarMapa(true)} />
      )}
      {mostrarMapa && <Map />}
    </main>
  )
}