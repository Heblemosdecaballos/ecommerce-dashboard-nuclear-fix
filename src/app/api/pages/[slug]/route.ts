// app/api/pages/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSafeSupabaseServerClient } from "@/lib/safeSupabaseServer";

// Función supa() removida - usando createSafeSupabaseServerClient() directamente

// GET público (si published=true por RLS)
export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createSafeSupabaseServerClient();

  // Si Supabase no está disponible, retornar null o fallback
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("pages")
    .select("slug,title,body,updated_at,published")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data);
}

// PUT requiere ser autor por RLS
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createSafeSupabaseServerClient();

  // Si Supabase no está disponible, retornar null o fallback
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { title, body, published } = await req.json();
  const { error } = await supabase.from("pages")
    .update({ title, body, published })
    .eq("slug", params.slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE requiere ser autor por RLS
export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createSafeSupabaseServerClient();

  // Si Supabase no está disponible, retornar null o fallback
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { error } = await supabase.from("pages").delete().eq("slug", params.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
