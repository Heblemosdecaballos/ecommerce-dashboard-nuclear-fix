
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hablando de Caballos',
  description: 'Portal dedicado a los caballos de paso fino colombiano',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
