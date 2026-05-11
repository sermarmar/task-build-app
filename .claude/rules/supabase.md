# Reglas Supabase

## Arquitectura de acceso a datos

- Todo acceso a Supabase va en `src/repository/`. Los servicios en `src/services/` llaman a los repositorios, nunca a Supabase directamente.
- Nunca importar el cliente de Supabase desde un componente o hook.
- El cliente Supabase se instancia una sola vez en `src/lib/supabaseClient.ts`.

## Queries

- Comprobar siempre el campo `error` antes de usar `data`:
  ```ts
  const { data, error } = await supabase.from('habits').select('*')
  if (error) throw new Error(error.message)
  ```
- Nunca usar `.single()` a menos que estés 100% seguro de que la query devuelve exactamente una fila. Usar `.maybeSingle()` si puede no existir.
- Para fetching paralelo, usar `Promise.all`:
  ```ts
  const [habits, tasks] = await Promise.all([
    habitRepository.getAll(userId),
    taskRepository.getAll(userId),
  ])
  ```

## Esquema de base de datos

- Primary keys: siempre UUID con `gen_random_uuid()` como default.
- Timestamps: `created_at` y `updated_at` en todas las tablas con `DEFAULT now()`.
- Enum `habit_frequency`: valores `daily`, `weekly`, `custom`.
- `custom_days`: columna `SMALLINT[]`, donde 0=Domingo, 1=Lunes, …, 6=Sábado.
- Tabla `habit_logs`: registra un log por hábito por fecha. Tiene índice único en `(habit_id, date)`.

## Filtros y operadores PostgREST

- Para rangos de fechas usar `.gte()` y `.lte()`.
- Para arrays usar `.overlaps()` o el operador `ov` en `.or()`.
- Para relaciones anidadas, usar la sintaxis: `select('*, tabla_relacionada(campo1, campo2)')`.
- Tener cuidado con el nombre de la foreign key en embeds anidados — debe coincidir exactamente con el nombre de la constraint en la DB.

## RLS (Row Level Security)

- Todas las tablas tienen RLS activado.
- Las políticas filtran siempre por `auth.uid() = user_id`.
- Nunca asumir que un usuario puede ver datos de otro usuario.

## Migraciones

- Documentar cualquier cambio de esquema en `supabase/migrations/`.
- No modificar la DB directamente en producción sin una migración.
