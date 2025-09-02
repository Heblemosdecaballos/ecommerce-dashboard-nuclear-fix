// app/api/news/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSafeSupabaseServerClient } from "@/lib/safeSupabaseServer";

// Función supa() removida - usando createSafeSupabaseServerClient() directamente

// GET público (si published=true)
export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const db = createSafeSupabaseServerClient();
  const { data, error } = await db
    .from("news")
    .select("slug,title,excerpt,body,cover_url,created_at,updated_at,published")
    .eq("slug", params.slug)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const db = createSafeSupabaseServerClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { title, excerpt, body, cover_url, published } = await req.json();
  const { error } = await db.from("news")
    .update({ title, excerpt, body, cover_url, published })
    .eq("slug", params.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  const db = createSafeSupabaseServerClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { error } = await db.from("news").delete().eq("slug", params.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
