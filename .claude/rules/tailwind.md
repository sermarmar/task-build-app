# Reglas Tailwind CSS v4

## Composición de clases

- Siempre usar `clsx` + `twMerge` para combinar clases. Nunca concatenación manual con template literals.
  ```ts
  import { clsx } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
  ```
- Crear el helper `cn` en `src/utils/cn.ts` y usarlo en todos los componentes.

## Tailwind v4 — diferencias importantes

- En v4 no hay `tailwind.config.js` tradicional — la configuración va en el CSS con `@theme`.
- Las clases personalizadas se definen con variables CSS en `@theme {}` en el archivo CSS principal.
- No usar `@apply` salvo para casos muy justificados — preferir clases directas en el JSX.

## Patrones

- Para variantes de componentes, usar un objeto de variantes con `clsx`:
  ```ts
  const variants = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 text-gray-900',
  }
  // uso: cn(variants[variant], className)
  ```
- Para responsive, siempre mobile-first: `base → sm: → md: → lg:`.
- Para dark mode, usar la variante `dark:` si el proyecto lo soporta.

## Lo que NO hacer

- No mezclar estilos inline con Tailwind salvo para valores dinámicos que no se pueden expresar con clases.
- No crear clases Tailwind dinámicas con interpolación de strings (`bg-${color}-500`) — Tailwind no las detecta en el purge.
- No repetir grupos de clases en múltiples sitios — extraer a un componente o a una variante.
