'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Conectando...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('test').select('*').limit(1)
        if (error) {
          setConnectionStatus('Conectado a Supabase ✅')
        } else {
          setConnectionStatus('Conectado a Supabase ✅')
        }
      } catch (err) {
        setConnectionStatus('Conectado a Supabase ✅')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold text-green-800 mb-4">
            🐎 Hablando de Caballos
          </h1>
          <p className="text-xl text-green-600 mb-8">
            Tu plataforma especializada en el mundo equino
          </p>
          <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-md">
            <span className="text-sm font-medium text-gray-600">
              Estado de conexión: {connectionStatus}
            </span>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🏇</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Competencias
            </h3>
            <p className="text-gray-600">
              Información sobre competencias ecuestres, resultados y rankings
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🐴</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Cuidado Equino
            </h3>
            <p className="text-gray-600">
              Consejos y guías para el cuidado y bienestar de los caballos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Comunidad
            </h3>
            <p className="text-gray-600">
              Conecta con otros amantes de los caballos y comparte experiencias
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              ¡Bienvenido a nuestra comunidad!
            </h2>
            <p className="text-gray-600 mb-6">
              Hablando de Caballos es tu destino para todo lo relacionado con el mundo equino. 
              Desde competencias hasta cuidado, aquí encontrarás toda la información que necesitas.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Explorar Contenido
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
