
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Acerca de Hablando de Caballos
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Nuestra Misión
          </h2>
          <p className="text-gray-600 mb-4">
            Hablando de Caballos es un portal dedicado a preservar y compartir 
            la rica tradición del caballo de paso fino colombiano. Nuestro objetivo 
            es crear una comunidad donde los amantes de estos magníficos equinos 
            puedan encontrar información, historia y conectar con otros entusiastas.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            El Paso Fino Colombiano
          </h2>
          <p className="text-gray-600 mb-4">
            El caballo de paso fino colombiano es una raza única, conocida por 
            su elegancia, suavidad de movimientos y temperamento noble. Estos 
            caballos han sido parte integral de la cultura colombiana durante siglos.
          </p>
        </div>

        <div className="text-center">
          <a 
            href="/" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    </div>
  )
}
