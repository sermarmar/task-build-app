---
name: fix-build
description: Diagnostica y corrige errores de build de TypeScript o Vite. Úsalo cuando tsc -b o vite build fallen antes de un deploy a Vercel.
---

# Skill: Fix Build TypeScript / Vite

## Proceso de diagnóstico

1. Ejecutar `tsc -b 2>&1` y capturar todos los errores
2. Agrupar errores por tipo:
   - Errores de tipos (`TS2322`, `TS2345`, `TS2339`...)
   - Imports no encontrados (`TS2307`)
   - Null/undefined no manejados (`TS2531`, `TS18048`)
3. Corregir de más específico a más general (los errores en tipos base suelen propagar)

## Errores frecuentes en este proyecto

### Import con alias `@/` no resuelto
```
Cannot find module '@/services/...' or its corresponding type declarations
```
→ Verificar que `tsconfig.json` tiene `paths` configurado y que `vite.config.ts` tiene el alias equivalente.

### Supabase devuelve `null` no manejado
```
Type 'X | null' is not assignable to type 'X'
```
→ Añadir guard: `if (!data) return` o usar optional chaining.

### Props faltantes en componente
```
Property 'X' is missing in type '{}' but required in type 'Props'
```
→ Hacer la prop opcional con `?` o pasarla desde el padre.

### Enum/tipo no exportado
```
Module '"@/types/..."' has no exported member 'X'
```
→ Añadir el export al archivo de tipos correspondiente.

## Checklist de verificación final

- [ ] `tsc -b` sin errores
- [ ] `vite build` completa sin errores
- [ ] No hay `// @ts-ignore` nuevos sin justificación
- [ ] Variables de entorno `VITE_` referenciadas correctamente
