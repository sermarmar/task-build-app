# Reglas TypeScript

## Compilación

- Siempre ejecutar `tsc -b` antes de hacer commit o push.
- Cero errores de TypeScript tolerados en `master`. Si hay errores de build, corregirlos antes de continuar.
- Usar `strict: true` en `tsconfig.json`. No desactivar checks con `// @ts-ignore` salvo casos extremos documentados.

## Tipos

- Definir todos los tipos e interfaces en `src/types/`. Un archivo por dominio (ej: `habit.types.ts`, `task.types.ts`).
- Nunca usar `any`. Si es necesario tipar algo dinámico, usar `unknown` y narrowing.
- Preferir `interface` para objetos de dominio, `type` para uniones y utilidades.
- Los enums de dominio van en `src/types/` como `const enum` o union de strings literales.

## Imports

- Siempre usar el alias `@/` para imports internos. Ejemplo: `import { HabitService } from '@/services/habitService'`.
- Agrupar imports: 1) librerías externas, 2) alias internos `@/`, 3) relativos (solo si son del mismo módulo).

## Componentes

- Tipar siempre las props con una `interface Props` local o importada.
- Tipar el retorno de custom hooks explícitamente.
- Usar `React.FC` solo si necesitas `children` explícito; en el resto, funciones normales con props tipadas.

## Errores comunes a evitar

- No usar `!` (non-null assertion) sin un comentario que justifique por qué es seguro.
- No asumir que Supabase devuelve datos sin comprobar `error` primero.
- No desestructurar props sin tiparlas antes.
