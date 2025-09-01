
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Durante el build, evitar rutas problemáticas
  if (process.env.NEXT_DISABLE_REDIS === '1') {
    const url = request.nextUrl.clone();
    
    // Si es una ruta de socket/stats durante build, devolver respuesta mock
    if (url.pathname.includes('/api/socket/stats')) {
      return NextResponse.json({
        stats: {
          activeUsers: 0,
          totalGames: 0,
          onlineUsers: 0
        },
        message: 'Build mode - Redis disabled'
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/socket/:path*'
  ]
};
