'use client';

import { createSafeSupabaseBrowserClient, isSupabaseAvailable } from '@/lib/safeSupabase';

export default function LoginButton() {
  const login = async () => {
    const supabase = createSafeSupabaseBrowserClient();
    
    if (!supabase) {
      alert('Autenticación no disponible. Supabase no está configurado.');
      return;
    }

    const origin = window.location.origin;
    const next = window.location.pathname || '/';

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
  };

  // Si Supabase no está disponible, mostrar mensaje
  if (!isSupabaseAvailable) {
    return (
      <div className="rounded-md bg-gray-400 px-4 py-2 text-white cursor-not-allowed">
        Autenticación no disponible
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
    >
      Iniciar sesión con Google
    </button>
  );
}
