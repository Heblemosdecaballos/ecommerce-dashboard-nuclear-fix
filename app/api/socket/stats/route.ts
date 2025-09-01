
// App Router version - Marcar como dinámico
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { safeRedisOperation } from '../../../../src/lib/redis';

export async function GET(request: NextRequest) {
  // Evitar timeout durante build
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined) {
    return NextResponse.json({ 
      message: 'Stats disabled during build',
      stats: {
        activeUsers: 0,
        totalGames: 0,
        onlineUsers: 0
      }
    });
  }

  try {
    // Usar operación Redis segura con fallback
    const stats = await safeRedisOperation(
      async () => {
        const client = require('../../../../src/lib/redis').getRedisClient();
        if (!client) throw new Error('Redis not available');
        
        const [activeUsers, totalGames, onlineUsers] = await Promise.all([
          client.get('stats:activeUsers') || '0',
          client.get('stats:totalGames') || '0',
          client.get('stats:onlineUsers') || '0'
        ]);

        return {
          activeUsers: parseInt(activeUsers),
          totalGames: parseInt(totalGames),
          onlineUsers: parseInt(onlineUsers)
        };
      },
      // Fallback cuando Redis no está disponible
      {
        activeUsers: 0,
        totalGames: 0,
        onlineUsers: 0
      }
    );

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Stats API error:', error);
    
    // Respuesta de fallback
    return NextResponse.json({
      stats: {
        activeUsers: 0,
        totalGames: 0,
        onlineUsers: 0
      },
      error: 'Stats temporarily unavailable'
    }, { status: 200 });
  }
}
