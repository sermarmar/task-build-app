# Reglas de caché con sessionStorage

## Principio general

Los servicios que cachean datos en `sessionStorage` deben mantener la caché sincronizada después de cualquier mutación. **Nunca dejes la caché obsoleta** tras un `create`, `update` o `delete` exitoso.

## Cuándo actualizar

Actuar **solo si la operación en Supabase no devuelve error**. Si hay error, no tocar `sessionStorage`.

## Estrategia por tipo de operación

### create
Invalida la clave completa. El siguiente `getAll` la reconstruirá desde Supabase:
```ts
sessionStorage.removeItem('categories');
```

### delete
Igual que `create`: invalida la clave completa.
```ts
sessionStorage.removeItem('tasks');
```

### update
Actualiza el item en sitio dentro del array cacheado, sin invalidar el resto:
```ts
const cached = sessionStorage.getItem('categories');
if (cached) {
    const items = JSON.parse(cached);
    const updated = items.map((item: Category) =>
        item.id === id ? { ...item, ...changes } : item
    );
    sessionStorage.setItem('categories', JSON.stringify(updated));
}
```
Usa `removeItem` en update solo si el cambio afecta a relaciones embebidas que no puedes actualizar fácilmente en sitio (ej: un campo `join` anidado). En ese caso documenta por qué.

## Claves actuales del proyecto

| Clave              | Servicio responsable     | Descripción                        |
|--------------------|--------------------------|------------------------------------|
| `categories`       | `CategoryService`        | Array de `Category` con grupo embebido |
| `groups`           | `GroupService`           | Array de `Group` con categorías embebidas |
| `status`           | `StatusService`          | Array de `Status`                  |
| `tasks`            | `RetrieveTaskService`    | Array de `Task`                    |
| `user`             | `AuthProvider`           | Objeto `User` de sesión            |

## Caché entre entidades relacionadas

Si actualizas una entidad que está embebida en otra (ej: el `color` de un `Group` aparece dentro de `categories`), actualiza **ambas claves**. Ver `GroupService.updateGroupColor` como referencia.

## Añadir una nueva entidad cacheada

1. Definir la clave como constante en el servicio: `const CACHE_KEY = 'mi-entidad'`.
2. Añadir la clave a la tabla de arriba en esta regla.
3. Implementar `clearCache()` en el servicio.
4. Asegurarse de que el logout llama a `clearCache()` o que `sessionStorage.clear()` en `AuthProvider` la limpia.
