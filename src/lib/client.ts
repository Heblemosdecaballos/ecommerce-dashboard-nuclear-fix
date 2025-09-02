// /lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import { isSupabaseAvailable } from "./safeSupabase";

/**
 * Cliente de Supabase para el NAVEGADOR
 * (persistencia de sesión habilitada)
 */
export function createSupabaseBrowser() {
  // Verificar si Supabase está disponible
  if (!isSupabaseAvailable) {
    console.warn('Supabase no está configurado correctamente. Retornando null.');
    return null;
  }

  try {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );
  } catch (error) {
    console.error('Error creando cliente Supabase browser:', error);
    return null;
  }
}

/* ===== Alias para compatibilidad con imports antiguos ===== */
export const createSupabaseBrowserClient = createSupabaseBrowser;
export const createSupabaseClient = createSupabaseBrowser;
export const createSupabaseBrowserClientReadOnly = createSupabaseBrowser;
export const createSupabaseBrowserReadOnly = createSupabaseBrowser;

/**
 * Export default: la FACTORÍA (función), no la instancia,
 * para que puedas usar: `const supa = createSupabaseBrowser()`
 */
export default createSupabaseBrowser;
