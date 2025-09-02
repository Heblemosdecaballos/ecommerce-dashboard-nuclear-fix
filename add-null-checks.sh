#!/bin/bash

# Script para agregar verificaciones de null después de crear clientes Supabase
echo "🔧 Agregando verificaciones de null para clientes Supabase..."

# Función para agregar verificaciones de null
add_null_checks() {
    local file="$1"
    echo "📝 Procesando: $file"
    
    # Crear backup si no existe
    if [ ! -f "$file.backup" ]; then
        cp "$file" "$file.backup"
    fi
    
    # Patrón para encontrar asignaciones de cliente Supabase
    # Buscar líneas como: const supabase = createSafeSupabase...()
    if grep -q "const.*=.*createSafeSupabase.*Client()" "$file"; then
        echo "  ✓ Encontradas asignaciones de cliente Supabase"
        
        # Agregar verificación después de la asignación
        # Esto es un ejemplo básico - en la práctica necesitarías lógica más específica
        sed -i '/const.*=.*createSafeSupabase.*Client()/a\
\
    if (!supabase) {\
      console.warn("Supabase no está disponible");\
      return null; // o return fallback apropiado\
    }' "$file"
    fi
}

# Procesar archivos de API routes que son críticos
echo "🔍 Procesando API routes..."
find ./src/app/api -name "*.ts" | while read file; do
    if grep -q "createSafeSupabase" "$file"; then
        add_null_checks "$file"
    fi
done

echo "✅ Verificaciones de null agregadas!"
echo "⚠️  IMPORTANTE: Revisa manualmente los archivos para ajustar la lógica de fallback"
echo "   Algunos archivos pueden necesitar lógica específica en lugar de 'return null'"
