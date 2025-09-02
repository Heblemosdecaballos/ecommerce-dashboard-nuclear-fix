// app/api/stories/[id]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSafeSupabaseServerClient } from "@/lib/safeSupabaseServer";

// Función supa() removida - usando createSafeSupabaseServerClient() directamente

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSafeSupabaseServerClient();

  // Si Supabase no está disponible, retornar null o fallback
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("story_comments")
    .select("id,body,author_id,parent_id,created_at")
    .eq("story_id", params.id)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSafeSupabaseServerClient();

  // Si Supabase no está disponible, retornar null o fallback
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { body, parent_id } = await req.json();
  if (!body || !body.trim()) return NextResponse.json({ error: "El comentario no puede ir vacío" }, { status: 400 });

  const { error } = await supabase.from("story_comments")
    .insert({ story_id: params.id, author_id: user.id, body, parent_id: parent_id ?? null });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
