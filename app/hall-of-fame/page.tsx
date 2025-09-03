
export default function HallOfFamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hall of Fame
        </h1>
        <p className="text-xl text-gray-600">
          Los caballos más destacados del paso fino colombiano
        </p>
      </header>

      <main>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Próximamente
          </h2>
          <p className="text-gray-600 mb-4">
            Esta sección estará disponible próximamente con información detallada 
            sobre los caballos más destacados en la historia del paso fino colombiano.
          </p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    </div>
  )
}
