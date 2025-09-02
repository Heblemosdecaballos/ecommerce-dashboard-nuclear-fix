// utils/supabase/browser.ts
'use client'

import { createSafeSupabaseBrowserClient } from "@/lib/safeSupabase"

export function supabaseBrowser() {
  return createSafeSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
