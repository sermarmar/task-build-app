# Reglas Git y Deploy

## Ramas

- Rama principal: `master` — es la que despliega en Vercel automáticamente.
- Para features nuevas, crear rama con formato: `feature/nombre-corto`.
- Para fixes: `fix/descripcion-breve`.
- Nunca trabajar directamente en `master` salvo hotfixes urgentes.

## Commits

- Formato de mensaje: `tipo(scope): descripción corta en imperativo`
- Tipos: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`
- Ejemplos:
  - `feat(habits): añadir filtro por frecuencia en el board`
  - `fix(supabase): corregir query de habit_logs con rango de fechas`
  - `refactor(context): separar HabitBoardProvider de HabitBoardContext`

## Antes de hacer push a master

1. `tsc -b` — cero errores de TypeScript
2. `vite build` — build limpio sin warnings críticos
3. Revisar que no hay `console.log` de debug olvidados
4. Comprobar que las variables de entorno en Vercel están actualizadas si se añadió alguna nueva

## Variables de entorno

- Las variables de Supabase van en `.env.local` (gitignored).
- Prefijo obligatorio `VITE_` para que Vite las exponga al cliente.
- En Vercel, configurar las mismas variables en el panel de Environment Variables.
- Nunca hardcodear URLs o keys de Supabase en el código.

## Deploy en Vercel

- Repositorio: `sermarmarr/task-build-app`
- Deploy automático en cada push a `master`.
- Si el build falla en Vercel, revisar primero los logs de TypeScript — suelen ser errores de tipos que no se detectaron en local.
