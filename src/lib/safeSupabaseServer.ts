// src/lib/safeSupabaseServer.ts
// Wrapper seguro para Supabase (SOLO SERVIDOR) que maneja la ausencia de credenciales válidas

import { cookies } from 'next/headers';
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

// Verificar si las variables de entorno de Supabase están configuradas correctamente
function hasValidSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Verificar que existan y no sean valores de demo/placeholder
  return !!(
    url && 
    key && 
    url !== "https://demo-project.supabase!.co" &&
    key !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ1MDk1MzM1LCJleHAiOjE5NjA2NzEzMzV9.demo-key-for-development-only" &&
    url.includes('supabase!.co') &&
    key.length > 50
  );
}

// Export para verificar si Supabase está disponible
export const isSupabaseAvailable = hasValidSupabaseConfig();

// Cliente seguro para server
export function createServerClient() {
  if (!hasValidSupabaseConfig()) {
    console.warn('Supabase no está configurado correctamente. Usando cliente mock.');
    return null;
  }

  try {
    const cookieStore = cookies();
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );
  } catch (error) {
    console.error('Error creando cliente Supabase server:', error);
    return null;
  }
}

// Cliente seguro para server (solo lectura)
export function createServerClientReadOnly() {
  if (!hasValidSupabaseConfig()) {
    console.warn('Supabase no está configurado correctamente. Usando cliente mock.');
    return null;
  }

  try {
    const cookieStore = cookies();
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(_name: string, _value: string, _options: CookieOptions) {},
          remove(_name: string, _options: CookieOptions) {},
        },
      }
    );
  } catch (error) {
    console.error('Error creando cliente Supabase server (readonly):', error);
    return null;
  }
}

// Función helper para operaciones seguras con Supabase (servidor)
export async function safeSupabaseServerOperation<T>(
  operation: (client: any) => Promise<T>,
  fallback: T,
  readonly: boolean = false
): Promise<T> {
  const client = readonly 
    ? createServerClientReadOnly()
    : createServerClient();

  if (!client) {
    console.log('Supabase no disponible, usando fallback');
    return fallback;
  }

  try {
    return await operation(client);
  } catch (error) {
    console.error('Error en operación Supabase server:', error);
    return fallback;
  }
}

// Aliases para compatibilidad con código existente
export const supabaseServer = createServerClient;
export const createSupabaseServerClient = createServerClient;
export const createSupabaseServerClientReadOnly = createServerClientReadOnly;
export const createClient = createServerClient;

export default createServerClient;
