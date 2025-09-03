// /src/lib/supabaseClient.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Para desarrollo, usar credenciales de demo si no hay reales configuradas
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('demo-project') || 
      supabaseUrl.includes('example') ||
      supabaseAnonKey.includes('demo-key') ||
      supabaseAnonKey.includes('placeholder')) {
    
    console.warn('⚠️ Using demo Supabase credentials for development');
    
    // Crear un cliente mock para desarrollo
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'DEMO_MODE' } }),
            order: () => Promise.resolve({ data: [], error: null })
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          or: () => ({
            order: () => Promise.resolve({ data: [], error: null })
          }),
          in: () => Promise.resolve({ data: [], error: null })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database operations' } })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database operations' } })
            })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: { message: 'Demo mode - no database operations' } })
        })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: { message: 'Demo mode - no storage operations' } }),
          getPublicUrl: () => ({ data: { publicUrl: '/placeholder-image.jpg' } })
        })
      }
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();
