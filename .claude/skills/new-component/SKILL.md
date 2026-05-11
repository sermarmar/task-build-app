---
name: new-component
description: Crea un nuevo componente React reutilizable siguiendo la arquitectura del proyecto. Úsalo cuando el usuario pida crear un componente, widget, card, modal, o cualquier pieza de UI nueva.
---

# Skill: Nuevo Componente React

## Pasos a seguir

1. **Identificar el dominio** — ¿a qué módulo pertenece? (habits, tasks, pomodoro, wellness, shared)
2. **Determinar si necesita contexto** — ¿necesita acceder a un Provider? ¿o recibe todo por props?
3. **Crear el archivo** en `src/components/[dominio]/NombreComponente.tsx`

## Plantilla base

```tsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: any[]) => twMerge(clsx(inputs))

interface Props {
  // definir props aquí
  className?: string
}

export function NombreComponente({ className }: Props) {
  return (
    <div className={cn('', className)}>
      {/* contenido */}
    </div>
  )
}
```

## Checklist antes de entregar

- [ ] Props tipadas con interfaz
- [ ] `className` opcional para permitir override desde el padre
- [ ] Sin lógica de negocio — si la necesita, extraer a un hook o servicio
- [ ] Sin imports de Supabase directamente
- [ ] Exportación nombrada (no default export)
- [ ] Nombre del archivo en PascalCase
