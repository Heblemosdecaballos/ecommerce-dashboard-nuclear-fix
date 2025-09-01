
// Redis client con protección para build time
let redisClient: any = null;

// Función para verificar si Redis está habilitado
function isRedisEnabled(): boolean {
  return process.env.REDIS_DISABLED !== '1' && 
         process.env.NEXT_DISABLE_REDIS !== '1' &&
         typeof window === 'undefined'; // Solo en servidor
}

// Función para obtener cliente Redis de forma segura
export function getRedisClient() {
  // Si Redis está deshabilitado o estamos en build time, retornar null
  if (!isRedisEnabled()) {
    console.log('Redis deshabilitado durante build o por configuración');
    return null;
  }

  // Solo importar Redis si realmente lo necesitamos
  if (!redisClient) {
    try {
      // Importación dinámica para evitar errores en build time
      const Redis = require('ioredis');
      redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      
      redisClient.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
        redisClient = null;
      });
    } catch (error) {
      console.error('Error importing Redis:', error);
      return null;
    }
  }

  return redisClient;
}

// Función stub para operaciones Redis
export async function safeRedisOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  const client = getRedisClient();
  
  if (!client) {
    console.log('Redis no disponible, usando fallback');
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.error('Redis operation failed:', error);
    return fallback;
  }
}

// Exportar cliente de forma segura
export { redisClient };
