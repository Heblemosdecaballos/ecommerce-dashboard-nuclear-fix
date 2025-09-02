#!/bin/bash

# Script para corregir Server Components que usan Supabase incorrectamente
echo "🔧 Corrigiendo Server Components..."

# Función para corregir archivos de Server Components
fix_server_component() {
    local file="$1"
    echo "📝 Procesando: $file"
    
    # Backup del archivo original
    cp "$file" "$file.backup"
    
    # Verificar si es un Server Component (no tiene "use client")
    if ! grep -q "use client" "$file"; then
        echo "  ✓ Es un Server Component"
        
        # Remover imports de cookies si existen
        sed -i '/import.*cookies.*from.*next\/headers/d' "$file"
        
        # Simplificar funciones supa() que crean clientes manualmente
        sed -i '/function supa() {/,/^}/c\
// Función supa() removida - usando createSafeSupabaseServerClient() directamente' "$file"
        
        # Reemplazar llamadas a supa() con createSafeSupabaseServerClient()
        sed -i 's/const supabase = supa();/const supabase = createSafeSupabaseServerClient();/' "$file"
        sed -i 's/const supa = supa();/const supa = createSafeSupabaseServerClient();/' "$file"
        
        # Agregar verificación de null después de crear cliente
        sed -i '/const supabase = createSafeSupabaseServerClient();/a\
\
  \/\/ Si Supabase no está disponible, retornar null o fallback\
  if (!supabase) {\
    return null;\
  }' "$file"
        
        sed -i '/const supa = createSafeSupabaseServerClient();/a\
\
  \/\/ Si Supabase no está disponible, retornar null o fallback\
  if (!supa) {\
    return null;\
  }' "$file"
    else
        echo "  ⚠️  Es un Client Component - requiere revisión manual"
    fi
}

# Procesar archivos que importan safeSupabaseServer
echo "🔍 Buscando archivos que usan safeSupabaseServer..."
find . -name "*.tsx" -o -name "*.ts" | \
    grep -v node_modules | \
    grep -v .backup | \
    xargs grep -l "safeSupabaseServer" 2>/dev/null | \
    while read file; do
        fix_server_component "$file"
    done

echo "✅ Corrección de Server Components completada!"
echo "📋 Se crearon backups con extensión .backup"
