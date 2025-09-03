
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hablando de Caballos
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Portal dedicado a los caballos de paso fino colombiano, 
          su historia, características y el mundo ecuestre.
        </p>
      </header>

      <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Hall of Fame
          </h2>
          <p className="text-gray-600 mb-4">
            Descubre los caballos más destacados en la historia del paso fino colombiano.
          </p>
          <a 
            href="/hall-of-fame" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Ver Hall of Fame
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Administración
          </h2>
          <p className="text-gray-600 mb-4">
            Panel de administración para gestionar contenido y usuarios.
          </p>
          <a 
            href="/admin" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Ir a Admin
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Acerca de
          </h2>
          <p className="text-gray-600 mb-4">
            Conoce más sobre nuestra misión y el mundo del paso fino colombiano.
          </p>
          <a 
            href="/about" 
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Saber más
          </a>
        </div>
      </main>

      <footer className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-500">
          © 2024 Hablando de Caballos. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
