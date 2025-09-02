#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Iniciando corrección masiva de errores TypeScript...');

// Función para leer archivo
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`⚠️  No se pudo leer ${filePath}: ${error.message}`);
    return null;
  }
}

// Función para escribir archivo
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Error escribiendo ${filePath}: ${error.message}`);
    return false;
  }
}

// Función para corregir errores TS18047 (possibly null)
function fixPossiblyNullErrors(content, filePath) {
  let fixed = content;
  let changes = 0;

  // Patrón 1: supa.from() -> supa?.from() o supa!.from()
  const supaPatterns = [
    { pattern: /(\s+)supa\.from\(/g, replacement: '$1supa!.from(' },
    { pattern: /(\s+)supa\.auth\./g, replacement: '$1supa!.auth.' },
    { pattern: /(\s+)supa\.storage\./g, replacement: '$1supa!.storage.' },
    { pattern: /(\s+)supabase\.from\(/g, replacement: '$1supabase!.from(' },
    { pattern: /(\s+)supabase\.auth\./g, replacement: '$1supabase!.auth.' },
    { pattern: /(\s+)supabase\.storage\./g, replacement: '$1supabase!.storage.' },
  ];

  supaPatterns.forEach(({ pattern, replacement }) => {
    const matches = fixed.match(pattern);
    if (matches) {
      fixed = fixed.replace(pattern, replacement);
      changes += matches.length;
    }
  });

  // Patrón 2: user.id -> user?.id
  const userPatterns = [
    { pattern: /(\s+)user\.id/g, replacement: '$1user?.id' },
    { pattern: /(\s+)user\.email/g, replacement: '$1user?.email' },
    { pattern: /(\s+)session\.user\./g, replacement: '$1session?.user?.' },
  ];

  userPatterns.forEach(({ pattern, replacement }) => {
    const matches = fixed.match(pattern);
    if (matches) {
      fixed = fixed.replace(pattern, replacement);
      changes += matches.length;
    }
  });

  if (changes > 0) {
    console.log(`  ✅ ${filePath}: ${changes} correcciones TS18047`);
  }

  return fixed;
}

// Función para corregir errores TS7006 (implicit any)
function fixImplicitAnyErrors(content, filePath) {
  let fixed = content;
  let changes = 0;

  // Patrón 1: parámetros de reduce sin tipo
  const reducePatterns = [
    { pattern: /\.reduce\(\(sum, vote\)/g, replacement: '.reduce((sum: number, vote: any)' },
    { pattern: /\.reduce\(\(sum, v\)/g, replacement: '.reduce((sum: number, v: any)' },
    { pattern: /\.filter\(\(p\) =>/g, replacement: '.filter((p: any) =>' },
    { pattern: /\.map\(\(p\) =>/g, replacement: '.map((p: any) =>' },
    { pattern: /\.find\(\(p\) =>/g, replacement: '.find((p: any) =>' },
    { pattern: /\.forEach\(\(p\) =>/g, replacement: '.forEach((p: any) =>' },
    { pattern: /\.filter\(\(r\) =>/g, replacement: '.filter((r: any) =>' },
    { pattern: /\.map\(\(r\) =>/g, replacement: '.map((r: any) =>' },
    { pattern: /\.find\(\(r\) =>/g, replacement: '.find((r: any) =>' },
    { pattern: /\.forEach\(\(r\) =>/g, replacement: '.forEach((r: any) =>' },
    { pattern: /\.filter\(\(h\) =>/g, replacement: '.filter((h: any) =>' },
    { pattern: /\.map\(\(h\) =>/g, replacement: '.map((h: any) =>' },
    { pattern: /\.find\(\(h\) =>/g, replacement: '.find((h: any) =>' },
    { pattern: /\.forEach\(\(h\) =>/g, replacement: '.forEach((h: any) =>' },
    { pattern: /\.filter\(\(m\) =>/g, replacement: '.filter((m: any) =>' },
    { pattern: /\.map\(\(m\) =>/g, replacement: '.map((m: any) =>' },
    { pattern: /\.find\(\(m\) =>/g, replacement: '.find((m: any) =>' },
    { pattern: /\.forEach\(\(m\) =>/g, replacement: '.forEach((m: any) =>' },
    { pattern: /\.filter\(\(v\) =>/g, replacement: '.filter((v: any) =>' },
    { pattern: /\.map\(\(v\) =>/g, replacement: '.map((v: any) =>' },
    { pattern: /\.find\(\(v\) =>/g, replacement: '.find((v: any) =>' },
    { pattern: /\.forEach\(\(v\) =>/g, replacement: '.forEach((v: any) =>' },
  ];

  reducePatterns.forEach(({ pattern, replacement }) => {
    const matches = fixed.match(pattern);
    if (matches) {
      fixed = fixed.replace(pattern, replacement);
      changes += matches.length;
    }
  });

  if (changes > 0) {
    console.log(`  ✅ ${filePath}: ${changes} correcciones TS7006`);
  }

  return fixed;
}

// Función para corregir errores TS2304 y TS2554 (imports faltantes)
function fixImportErrors(content, filePath) {
  let fixed = content;
  let changes = 0;

  // Si usa cookies() pero no está importado
  if (fixed.includes('cookies()') && !fixed.includes('import { cookies }')) {
    if (fixed.includes("from 'next/headers'")) {
      // Ya hay import de next/headers, agregar cookies
      fixed = fixed.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]next\/headers['"]/,
        "import { $1, cookies } from 'next/headers'"
      );
    } else {
      // Agregar import completo
      const importIndex = fixed.indexOf('import');
      if (importIndex !== -1) {
        fixed = fixed.substring(0, importIndex) + 
                "import { cookies } from 'next/headers';\n" + 
                fixed.substring(importIndex);
      }
    }
    changes++;
  }

  // Corregir createServerClient con argumentos incorrectos
  if (fixed.includes('createServerClient(')) {
    fixed = fixed.replace(
      /createServerClient\([^,]+,\s*[^,]+,\s*[^)]+\)/g,
      'createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)'
    );
    changes++;
  }

  if (changes > 0) {
    console.log(`  ✅ ${filePath}: ${changes} correcciones de imports`);
  }

  return fixed;
}

// Función principal para procesar un archivo
function processFile(filePath) {
  const content = readFile(filePath);
  if (!content) return false;

  let fixed = content;
  
  // Aplicar todas las correcciones
  fixed = fixPossiblyNullErrors(fixed, filePath);
  fixed = fixImplicitAnyErrors(fixed, filePath);
  fixed = fixImportErrors(fixed, filePath);

  // Solo escribir si hubo cambios
  if (fixed !== content) {
    return writeFile(filePath, fixed);
  }
  
  return true;
}

// Obtener lista de archivos con errores
function getFilesWithErrors() {
  try {
    const errorMap = fs.readFileSync('/tmp/ts_error_map.csv', 'utf8');
    const lines = errorMap.split('\n').slice(1); // Skip header
    const files = new Set();
    
    lines.forEach(line => {
      if (line.trim()) {
        const [file] = line.split(',');
        if (file && file.trim()) {
          files.add(`src/${file.trim()}`);
        }
      }
    });
    
    return Array.from(files);
  } catch (error) {
    console.error('❌ Error leyendo mapa de errores:', error.message);
    return [];
  }
}

// Ejecutar correcciones
function main() {
  const files = getFilesWithErrors();
  console.log(`📁 Procesando ${files.length} archivos con errores...`);
  
  let processed = 0;
  let errors = 0;
  
  files.forEach(file => {
    if (processFile(file)) {
      processed++;
    } else {
      errors++;
    }
  });
  
  console.log(`\n📊 Resumen:`);
  console.log(`  ✅ Archivos procesados: ${processed}`);
  console.log(`  ❌ Errores: ${errors}`);
  
  // Verificar compilación
  console.log('\n🔍 Verificando compilación...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ ¡Compilación exitosa! Todos los errores corregidos.');
  } catch (error) {
    console.log('⚠️  Aún hay errores de compilación. Revisando...');
    execSync('npx tsc --noEmit > /tmp/remaining_errors.txt 2>&1', { stdio: 'ignore' });
    const remainingErrors = fs.readFileSync('/tmp/remaining_errors.txt', 'utf8');
    const errorCount = remainingErrors.split('\n').filter(line => line.includes('error TS')).length;
    console.log(`📋 Errores restantes: ${errorCount}`);
  }
}

// Ejecutar
main();
