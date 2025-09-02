// src/utils/supabase/server.ts
// Cliente de Supabase para Next App Router (Server Components / Server Actions).
// Incluye los exports que tu proyecto espera: `supabaseServer`,
// `createSupabaseServerClient`, `createSupabaseServerClientReadOnly` y `createClient`.

import { 
  createServerClient, 
  createServerClientReadOnly,
  supabaseServer as safeSupabaseServer,
  createSupabaseServerClient as safeCreateSupabaseServerClient,
  createClient as safeCreateClient
} from "@/lib/safeSupabaseServer";

/**
 * Cliente de lectura/escritura (mantiene la sesión actualizando cookies).
 * Uso común en Server Actions.
 */
export function supabaseServer() {
  return createServerClient();
}

/**
 * Alias explícito (muchos archivos lo usan con este nombre).
 */
export const createSupabaseServerClient = supabaseServer;

/**
 * Variante SOLO LECTURA: no modifica cookies/sesión.
 * Útil para lecturas donde no quieres mutar la respuesta.
 */
export function createSupabaseServerClientReadOnly() {
  return createServerClientReadOnly();
}

/**
 * Compatibilidad adicional: algunos módulos importan `createClient`.
 */
export const createClient = supabaseServer;

// Export default opcional por si algún sitio lo usa así.
export default supabaseServer;
