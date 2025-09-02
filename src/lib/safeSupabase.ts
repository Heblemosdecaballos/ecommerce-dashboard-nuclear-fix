// src/lib/safeSupabase.ts
// Wrapper seguro para Supabase (SOLO CLIENTE) que maneja la ausencia de credenciales válidas

import { createBrowserClient } from "@supabase/ssr";

// Verificar si las variables de entorno de Supabase están configuradas correctamente
function hasValidSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Verificar que existan y no sean valores de demo/placeholder
  return !!(
    url && 
    key && 
    url !== "https://demo-project.supabase.co" &&
    key !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ1MDk1MzM1LCJleHAiOjE5NjA2NzEzMzV9.demo-key-for-development-only" &&
    url.includes('supabase.co') &&
    key.length > 50
  );
}

// Export para verificar si Supabase está disponible
export const isSupabaseAvailable = hasValidSupabaseConfig();

// Cliente seguro para browser
export function createSafeSupabaseBrowserClient() {
  if (!hasValidSupabaseConfig()) {
    console.warn('Supabase no está configurado correctamente. Usando cliente mock.');
    return null;
  }

  try {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } catch (error) {
    console.error('Error creando cliente Supabase browser:', error);
    return null;
  }
}

// Función helper para operaciones seguras con Supabase (solo cliente)
export async function safeSupabaseOperation<T>(
  operation: (client: any) => Promise<T>,
  fallback: T
): Promise<T> {
  const client = createSafeSupabaseBrowserClient();

  if (!client) {
    console.log('Supabase no disponible, usando fallback');
    return fallback;
  }

  try {
    return await operation(client);
  } catch (error) {
    console.error('Error en operación Supabase:', error);
    return fallback;
  }
}

// Aliases para compatibilidad con código existente
export const createSupabaseBrowserClient = createSafeSupabaseBrowserClient;
export const createSupabaseBrowser = createSafeSupabaseBrowserClient;

export default createSafeSupabaseBrowserClient;
