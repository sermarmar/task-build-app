---
name: new-feature
description: Crea una nueva feature vertical completa bajo src/app/features/<nombre>/, incluyendo modelo, repositorio, servicio, contexto y componente raíz. Úsalo cuando el usuario pida añadir un nuevo módulo, funcionalidad, sección, o dominio al proyecto (ej: "crea la feature de notificaciones", "añade un módulo de objetivos").
---

# Skill: Nueva Feature Vertical

Una feature es un módulo autónomo que agrupa todo lo relacionado con un dominio: modelo de datos, acceso a Supabase, lógica de negocio, estado compartido y componentes de UI.

## Pasos a seguir

1. **Confirmar nombre** — en `camelCase` para carpetas y archivos, `PascalCase` para clases/interfaces/componentes.  
   Ejemplo: feature `goals` → carpeta `goals/`, modelo `Goal.ts`, repositorio `GoalRepository.ts`.

2. **Decidir qué subdirectorios crear** según la necesidad real:

| Subdirectorio | Cuándo crearlo |
|---|---|
| `models/` | Siempre — define la entidad del dominio |
| `resources/` | Siempre que haya DTOs de request/response hacia Supabase |
| `services/` | Siempre — un archivo por caso de uso |
| `components/` | Cuando la feature tiene UI propia |
| `contexts/` | Cuando hay estado compartido entre componentes de la feature |
| `helpers/` | Cuando hay utilidades específicas del dominio |
| `stores/` | Cuando se usa Zustand en lugar de Context |

3. **Crear el repositorio** en `src/app/infra/repositories/<Nombre>Repository.ts`  
   (los repositorios viven en `infra/`, fuera de la feature)

4. **Crear los archivos** siguiendo las plantillas de abajo.

5. **Registrar la feature** en `DashboardPage.tsx` o en la ruta correspondiente.

---

## Plantillas

### `models/<Nombre>.ts`

```ts
export interface NombreFeature {
  id: string
  user_id: string
  // campos del dominio
  created_at: string
  updated_at?: string
}
```

### `resources/<Nombre>Request.ts`

```ts
export type NombreFeatureRequest = {
  // solo los campos que viene del formulario / cliente
}
```

### `src/app/infra/repositories/<Nombre>Repository.ts`

```ts
import { supabase } from '@/config/Database'
import type { NombreFeature } from '@/app/features/<nombre>/models/NombreFeature'
import type { ErrorMessage } from '@/app/shared/Error'

export const NombreFeatureRepository = {

  getAll: async (): Promise<{ items: NombreFeature[]; error: ErrorMessage | null }> => {
    const { data, error } = await supabase
      .from('<tabla>')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { items: [], error: { message: 'No se pudieron recuperar los datos' } }
    return { items: data, error: null }
  },

  create: async (payload: Omit<NombreFeature, 'id' | 'created_at'>): Promise<{ item: NombreFeature | null; error: ErrorMessage | null }> => {
    const { data, error } = await supabase
      .from('<tabla>')
      .insert([payload])
      .select()
      .single()

    if (error) return { item: null, error: { message: 'No se pudo crear el registro' } }
    return { item: data, error: null }
  },

  update: async (id: string, payload: Partial<NombreFeature>): Promise<{ item: NombreFeature | null; error: ErrorMessage | null }> => {
    const { data, error } = await supabase
      .from('<tabla>')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) return { item: null, error: { message: 'No se pudo actualizar el registro' } }
    return { item: data, error: null }
  },

  delete: async (id: string): Promise<{ error: ErrorMessage | null }> => {
    const { error } = await supabase
      .from('<tabla>')
      .delete()
      .eq('id', id)

    if (error) return { error: { message: 'No se pudo eliminar el registro' } }
    return { error: null }
  },
}
```

> Nunca usar `.single()` cuando el resultado puede ser 0 filas — usar `.maybeSingle()` en su lugar.

### `services/<CasoDeUso>Service.ts` (uno por caso de uso)

```ts
import { NombreFeatureRepository } from '@/app/infra/repositories/NombreFeatureRepository'
import type { ErrorMessage } from '@/app/shared/Error'
import type { NombreFeature } from '../models/NombreFeature'
import type { NombreFeatureRequest } from '../resources/NombreFeatureRequest'

export const Create<Nombre>Service = {
  create: async (
    payload: NombreFeatureRequest
  ): Promise<{ item: NombreFeature | null; error: ErrorMessage | null }> => {
    return NombreFeatureRepository.create(payload)
  },
}
```

### `contexts/<Nombre>Context.tsx`

```tsx
import { createContext } from 'react'
import type { NombreFeature } from '../models/NombreFeature'

export interface NombreContextType {
  items: NombreFeature[]
  error: string
  refresh: () => void
  openModal: (open: boolean, item?: NombreFeature) => void
}

export const NombreContext = createContext<NombreContextType | null>(null)
```

### `contexts/use<Nombre>Context.tsx`

```tsx
import { useContext } from 'react'
import { NombreContext, type NombreContextType } from './<Nombre>Context'

export const use<Nombre>Context = (): NombreContextType => {
  const context = useContext(NombreContext)
  if (!context) throw new Error('use<Nombre>Context debe usarse dentro de <Nombre>Provider')
  return context
}
```

### `components/<Nombre>Board.tsx` (componente raíz de la feature)

```tsx
import { cn } from '@sglara/cn'

interface Props {
  className?: string
}

export function NombreBoard({ className }: Props) {
  return (
    <div className={cn('', className)}>
      {/* contenido de la feature */}
    </div>
  )
}
```

---

## Estructura final esperada

```
src/app/
├── infra/repositories/<Nombre>Repository.ts   ← acceso a Supabase
└── features/<nombre>/
    ├── models/<Nombre>.ts
    ├── resources/<Nombre>Request.ts
    ├── services/
    │   ├── Create<Nombre>Service.ts
    │   └── Retrieve<Nombre>Service.ts
    ├── contexts/
    │   ├── <Nombre>Context.tsx
    │   ├── <Nombre>Provider.tsx
    │   └── use<Nombre>Context.tsx
    └── components/
        └── <Nombre>Board.tsx
```

---

## Checklist antes de entregar

- [ ] Modelo definido con todos los campos de la tabla
- [ ] Repositorio en `infra/repositories/` — sin lógica de negocio
- [ ] Servicios en `features/<nombre>/services/` — sin imports de Supabase
- [ ] Imports usando alias `@/` — nunca rutas relativas con `../../`
- [ ] Exportaciones nombradas — nunca `export default`
- [ ] Context + hook de acceso si hay estado compartido
- [ ] `ErrorMessage` como tipo de error (de `@/app/shared/Error`)
- [ ] `tsc -b` pasa sin errores tras añadir los archivos
