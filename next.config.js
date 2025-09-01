
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Deshabilitar Redis durante el build
    REDIS_DISABLED: process.env.NODE_ENV === 'production' ? '1' : '0',
    NEXT_DISABLE_REDIS: '1'
  },
  // Configuración para evitar generación estática de rutas problemáticas
  experimental: {
    serverComponentsExternalPackages: ['redis', 'ioredis']
  },
  // Excluir rutas problemáticas de la generación estática
  async rewrites() {
    return []
  },
  // Configuración de runtime
  async headers() {
    return [
      {
        source: '/api/socket/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
