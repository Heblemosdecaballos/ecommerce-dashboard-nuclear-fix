import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/safeSupabaseServer";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const to = next && next.startsWith("/") ? next : "/";

  if (code) {
    const supa = createServerClient();
    
    if (!supa) {
      return NextResponse.redirect(new URL("/auth/error", req.url));
    }
    
    await supa!.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(to, url.origin));
}
