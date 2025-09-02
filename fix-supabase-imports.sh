#!/bin/bash

# Script para actualizar imports de Supabase a versiones seguras
echo "🔧 Actualizando imports de Supabase a versiones seguras..."

# Función para reemplazar imports en archivos
replace_imports() {
    local file="$1"
    echo "📝 Procesando: $file"
    
    # Backup del archivo original
    cp "$file" "$file.backup"
    
    # Reemplazar imports de createBrowserClient
    sed -i 's/import { createBrowserClient } from "@supabase\/ssr"/import { createSafeSupabaseBrowserClient } from "@\/lib\/safeSupabase"/g' "$file"
    sed -i 's/import { createBrowserClient } from '\''@supabase\/ssr'\''/import { createSafeSupabaseBrowserClient } from "@\/lib\/safeSupabase"/g' "$file"
    
    # Reemplazar llamadas a createBrowserClient
    sed -i 's/createBrowserClient(/createSafeSupabaseBrowserClient(/g' "$file"
    
    # Reemplazar imports de createServerClient
    sed -i 's/import { createServerClient } from "@supabase\/ssr"/import { createSafeSupabaseServerClient } from "@\/lib\/safeSupabase"/g' "$file"
    sed -i 's/import { createServerClient } from '\''@supabase\/ssr'\''/import { createSafeSupabaseServerClient } from "@\/lib\/safeSupabase"/g' "$file"
    
    # Reemplazar llamadas a createServerClient
    sed -i 's/createServerClient(/createSafeSupabaseServerClient(/g' "$file"
    
    # Agregar verificación de null después de crear cliente
    if grep -q "createSafeSupabaseBrowserClient()" "$file" || grep -q "createSafeSupabaseServerClient()" "$file"; then
        # Agregar import de isSupabaseAvailable si no existe
        if ! grep -q "isSupabaseAvailable" "$file"; then
            sed -i 's/import { createSafeSupabaseBrowserClient } from "@\/lib\/safeSupabase"/import { createSafeSupabaseBrowserClient, isSupabaseAvailable } from "@\/lib\/safeSupabase"/g' "$file"
            sed -i 's/import { createSafeSupabaseServerClient } from "@\/lib\/safeSupabase"/import { createSafeSupabaseServerClient, isSupabaseAvailable } from "@\/lib\/safeSupabase"/g' "$file"
        fi
    fi
}

# Encontrar todos los archivos que usan Supabase
echo "🔍 Buscando archivos con referencias a Supabase..."

# Archivos TypeScript/JavaScript
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
    grep -v node_modules | \
    grep -v .next | \
    grep -v fix-supabase-imports.sh | \
    xargs grep -l "createBrowserClient\|createServerClient" 2>/dev/null | \
    while read file; do
        replace_imports "$file"
    done

echo "✅ Actualización de imports completada!"
echo "📋 Se crearon backups con extensión .backup"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Revisar los archivos actualizados"
echo "2. Agregar verificaciones de null donde sea necesario"
echo "3. Probar la aplicación"
echo "4. Si todo funciona, eliminar los archivos .backup"
