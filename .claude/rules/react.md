# Reglas React

## Arquitectura de contextos

- Los contextos globales se definen en `src/context/` con su Provider y su hook de consumo.
- Estructura de cada contexto:
  ```
  src/context/
  ├── HabitBoardContext.tsx   ← createContext + tipos
  ├── HabitBoardProvider.tsx  ← Provider con lógica y estado
  └── useHabitBoard.ts        ← hook de consumo con guard
  ```
- Los Providers se componen en `main.tsx` o en `App.tsx`, no dentro de páginas.
- Nunca acceder a un contexto sin el hook — exportar siempre el hook con un guard:
  ```ts
  export function useHabitBoard() {
    const ctx = useContext(HabitBoardContext)
    if (!ctx) throw new Error('useHabitBoard must be used within HabitBoardProvider')
    return ctx
  }
  ```

## Hooks

- Los custom hooks van en `src/hooks/`. Un archivo por hook.
- Prefijo `use` obligatorio.
- No mezclar lógica de fetching con lógica de UI en el mismo hook.
- Tipar el retorno del hook explícitamente con una interfaz.

## Formularios

- Usar React Hook Form para todos los formularios.
- Para pre-poblar un formulario con datos existentes (ej: editar hábito), usar `reset()` dentro de un `useEffect` con el objeto de datos como dependencia:
  ```ts
  useEffect(() => {
    if (habit) reset(habit)
  }, [habit, reset])
  ```
- Nunca usar `defaultValues` del `useForm` para datos que llegan async — siempre `reset()`.

## useEffect

- Documentar la razón de cada dependencia no obvia.
- Evitar efectos que disparan otros efectos en cadena — refactorizar a un solo efecto o a un servicio.
- Limpiar suscripciones y timers en el return del efecto.

## Componentes

- Componentes reutilizables en `src/components/`, organizados por dominio si hay muchos.
- Nunca lógica de negocio dentro de un componente — extraer a servicio o hook.
- Preferir composición sobre props drilling. Si hay más de 3 niveles de props drilling, usar contexto.

## Rendimiento

- Usar `React.memo` solo cuando haya un problema de rendimiento demostrado, no de forma preventiva.
- `useCallback` y `useMemo` solo cuando el cálculo es caro o la referencia importa para evitar re-renders.
