// app/api/stories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/safeSupabaseServer";

// Función supa() removida - usando createServerClient() directamente

// GET ?page=1&limit=12  -> lista de historias publicadas
export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  // Si Supabase no está disponible, retornar null o fallback
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") ?? 12)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("stories")
    .select("id,title,body,created_at,like_count,comment_count,story_media(url,kind)")
    .eq("status","published")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [], page, limit });
}

// POST {title,body,media:[{url,kind,width,height,duration_seconds}]}
export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  // Si Supabase no está disponible, retornar null o fallback
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }
  const { data: { user } } = await supabase!.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { title, body, media } = await req.json();
  const { data: story, error } = await supabase
    .from("stories")
    .insert({ author_id: user.id, title: title ?? null, body: body ?? null })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (Array.isArray(media) && media.length) {
    const rows = media.map((m: any) => ({
      story_id: story.id,
      kind: m.kind,
      url: m.url,
      width: m.width ?? null,
      height: m.height ?? null,
      duration_seconds: m.duration_seconds ?? null
    }));
    const { error: mErr } = await supabase!.from("story_media").insert(rows);
    if (mErr) return NextResponse.json({ error: mErr.message }, { status: 500 });
  }

  return NextResponse.json({ id: story.id });
}
