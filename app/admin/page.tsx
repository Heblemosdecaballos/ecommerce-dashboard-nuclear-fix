
export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Panel de Administración
        </h1>
        <p className="text-xl text-gray-600">
          Gestión de contenido y usuarios
        </p>
      </header>

      <main>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-4">
            Esta sección requiere autenticación. El sistema de administración 
            estará disponible próximamente.
          </p>
          <a 
            href="/" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    </div>
  )
}
