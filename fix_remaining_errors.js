#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo errores restantes...');

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

// Correcciones específicas para errores restantes
const specificFixes = [
  // Corregir createServerClient con argumentos incorrectos
  {
    file: 'src/app/api/threads/[id]/posts/route.ts',
    find: /createServerClient\([^,]+,\s*[^,]+,\s*[^)]+\)/g,
    replace: 'createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookies().get(name)?.value, set: (name: string, value: string, options: any) => cookies().set({ name, value, ...options }), remove: (name: string, options: any) => cookies().set({ name, value: "", ...options }) } })'
  },
  
  // Corregir parámetros implícitos any en funciones específicas
  {
    file: 'src/app/hall/[andar]/[horse]/page.tsx',
    find: /\.filter\(\(m\) =>/g,
    replace: '.filter((m: any) =>'
  },
  {
    file: 'src/app/hall/[andar]/page.tsx',
    find: /\.filter\(\(h\) =>/g,
    replace: '.filter((h: any) =>'
  },
  {
    file: 'src/app/hall/[andar]/page.tsx',
    find: /\.map\(\(h\) =>/g,
    replace: '.map((h: any) =>'
  },
  {
    file: 'src/app/foros/[slug]/page.tsx',
    find: /\.filter\(\(p\) =>/g,
    replace: '.filter((p: any) =>'
  },
  {
    file: 'src/app/foros/moderacion/page.tsx',
    find: /\.filter\(\(r\) =>/g,
    replace: '.filter((r: any) =>'
  },
  {
    file: 'src/app/foros/moderacion/page.tsx',
    find: /\.map\(\(r\) =>/g,
    replace: '.map((r: any) =>'
  },
  {
    file: 'src/app/api/hall/votes/route.ts',
    find: /\.filter\(\(v\) =>/g,
    replace: '.filter((v: any) =>'
  },
  {
    file: 'src/app/api/hall/votes/route.ts',
    find: /\.map\(\(v\) =>/g,
    replace: '.map((v: any) =>'
  }
];

// Aplicar correcciones específicas
specificFixes.forEach(fix => {
  const content = readFile(fix.file);
  if (content) {
    const newContent = content.replace(fix.find, fix.replace);
    if (newContent !== content) {
      writeFile(fix.file, newContent);
      console.log(`✅ Corregido: ${fix.file}`);
    }
  }
});

// Corrección masiva para errores 'possibly null' restantes
function fixRemainingNullErrors() {
  const errorFiles = [
    'src/app/api/hall/[slug]/route.ts',
    'src/app/api/moderate-post/route.ts',
    'src/app/api/pin-post/route.ts',
    'src/app/api/report-post/route.ts',
    'src/app/api/threads/route.ts',
    'src/app/api/unpin-thread/route.ts',
    'src/app/foros/nuevo/server-actions.ts',
    'src/app/historias/[id]/page.tsx'
  ];

  errorFiles.forEach(file => {
    const content = readFile(file);
    if (content) {
      let fixed = content;
      
      // Patrones específicos para 'possibly null'
      const patterns = [
        { find: /(\s+)supa\.from\(/g, replace: '$1supa!.from(' },
        { find: /(\s+)supa\.auth\./g, replace: '$1supa!.auth.' },
        { find: /(\s+)supa\.storage\./g, replace: '$1supa!.storage.' },
        { find: /(\s+)supabase\.from\(/g, replace: '$1supabase!.from(' },
        { find: /(\s+)supabase\.auth\./g, replace: '$1supabase!.auth.' },
        { find: /(\s+)supabase\.storage\./g, replace: '$1supabase!.storage.' },
        { find: /(\s+)supabase\.rpc\(/g, replace: '$1supabase!.rpc(' },
        { find: /(\s+)supa\.rpc\(/g, replace: '$1supa!.rpc(' }
      ];

      patterns.forEach(pattern => {
        fixed = fixed.replace(pattern.find, pattern.replace);
      });

      if (fixed !== content) {
        writeFile(file, fixed);
        console.log(`✅ Corregidos errores null en: ${file}`);
      }
    }
  });
}

fixRemainingNullErrors();

console.log('🎯 Correcciones específicas completadas');
