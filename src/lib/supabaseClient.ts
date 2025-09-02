// /src/lib/supabaseClient.ts
"use client";

import { createSafeSupabaseBrowserClient, isSupabaseAvailable } from "./safeSupabase";

function createSupabaseClient() {
  return createSafeSupabaseBrowserClient();
}

// Exportar cliente seguro (puede ser null si no está configurado)
export const supabase = createSupabaseClient();

// Exportar flag de disponibilidad
export { isSupabaseAvailable };
