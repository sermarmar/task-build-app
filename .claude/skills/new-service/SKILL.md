---
name: new-service
description: Crea un nuevo par repositorio + servicio para un módulo de datos. Úsalo cuando haya que añadir acceso a una nueva tabla de Supabase o nueva lógica de negocio de dominio.
---

# Skill: Nuevo Servicio y Repositorio

## Estructura a crear

```
src/
├── repository/[nombre]Repository.ts
├── services/[nombre]Service.ts
└── types/[nombre].types.ts
```

## Plantilla repositorio

```ts
// src/repository/ejemploRepository.ts
import { supabase } from '@/lib/supabaseClient'
import type { Ejemplo } from '@/types/ejemplo.types'

export const ejemploRepository = {
  async getAll(userId: string): Promise<Ejemplo[]> {
    const { data, error } = await supabase
      .from('ejemplos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async getById(id: string): Promise<Ejemplo | null> {
    const { data, error } = await supabase
      .from('ejemplos')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  },

  async create(payload: Omit<Ejemplo, 'id' | 'created_at'>): Promise<Ejemplo> {
    const { data, error } = await supabase
      .from('ejemplos')
      .insert(payload)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async update(id: string, payload: Partial<Ejemplo>): Promise<Ejemplo> {
    const { data, error } = await supabase
      .from('ejemplos')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ejemplos')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}
```

## Plantilla servicio

```ts
// src/services/ejemploService.ts
import { ejemploRepository } from '@/repository/ejemploRepository'
import type { Ejemplo } from '@/types/ejemplo.types'

export const ejemploService = {
  async getAll(userId: string): Promise<Ejemplo[]> {
    // Aquí va la lógica de negocio (transformaciones, filtros, ordenaciones)
    return ejemploRepository.getAll(userId)
  },

  async create(userId: string, datos: Omit<Ejemplo, 'id' | 'created_at' | 'user_id'>): Promise<Ejemplo> {
    return ejemploRepository.create({ ...datos, user_id: userId })
  },
}
```

## Checklist

- [ ] Tipos definidos en `src/types/[nombre].types.ts`
- [ ] Repositorio solo hace queries — sin lógica de negocio
- [ ] Servicio nunca toca Supabase directamente
- [ ] Siempre comprobar `error` antes de usar `data`
- [ ] Usar `maybeSingle()` en vez de `single()` cuando el resultado puede ser null
