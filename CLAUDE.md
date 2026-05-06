# task-build-app — Guía para Claude Code

Aplicación personal de productividad y bienestar. Combina gestión de tareas, hábitos, temporizador Pomodoro y panel de salud mental, todo bajo un `DashboardPage` compartido.

## Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS v4 + Vite
- **Backend**: Supabase (PostgreSQL + Auth + PostgREST)
- **Deploy**: Vercel (rama `master`)
- **Utilidades**: `clsx`, `twMerge`, React Hook Form, Path aliases con `@/`

## Estructura de carpetas

```
src/app/
├── components/           # Componentes reutilizables globales
│   ├── template/         # Piezas de layout (Navbar, Calendar, Select...)
│   └── ux/               # Primitivos UI (Button, Badge, Input, Card...)
├── contexts/             # Providers globales (AuthContext, NotificationProvider)
├── core/
│   ├── models/           # Modelos compartidos (Category, Status)
│   └── service/          # Servicios compartidos entre features
├── features/             # Módulos verticales por funcionalidad
│   └── <feature>/
│       ├── components/   # Componentes exclusivos de la feature
│       ├── contexts/     # Context + Provider + hook de acceso
│       ├── models/       # Tipos e interfaces propios de la feature
│       ├── resources/    # DTOs de request/response hacia Supabase
│       ├── services/     # Lógica de negocio (un archivo por caso de uso)
│       │   └── factory/  # Factories de mapeo (si aplica)
│       ├── helpers/      # Utilidades específicas de la feature
│       └── stores/       # Zustand stores (si la feature lo requiere)
├── hooks/                # Custom hooks globales
├── infra/
│   └── repositories/     # Acceso directo a Supabase (queries crudas)
├── pages/                # Vistas/rutas (DashboardPage, LoginPage...)
├── routes/               # Configuración de rutas (RouteProvider)
└── shared/               # Constantes, JSONs y helpers transversales
```

**Features actuales**: `habits`, `tasks`, `pomodoro`, `mental_health`, `calendar`, `category`, `login`

## Convenciones clave

- Arquitectura en capas: `repository` → `service` → `component`. Nunca saltar capas.
- Nueva funcionalidad siempre como feature vertical bajo `features/<nombre>/`.
- Imports con alias `@/` siempre. Nunca rutas relativas con `../../`.
- Nombres de archivos en `camelCase` para hooks/utils/services, `PascalCase` para componentes.
- Clases Tailwind siempre con `clsx` + `twMerge`. Nunca concatenación manual.
- `Promise.all` para fetching paralelo en servicios.

## Base de datos (Supabase)

- UUIDs como primary keys en todas las tablas.
- Enum `habit_frequency` con valores: `daily`, `weekly`, `custom`.
- `custom_days` como `SMALLINT[]` (0=Dom … 6=Sáb).
- Tabla `habit_logs` para registrar completados por fecha.
- Nunca usar `.single()` sin estar seguro de que devuelve exactamente 1 fila.

## Reglas inamovibles

1. Antes de cada deploy, pasar `tsc -b` sin errores.
2. Nunca commitear a `master` con errores de TypeScript.
3. Nunca poner lógica de negocio en los componentes — va en `services/`.
4. Nunca hacer queries a Supabase desde componentes — va en `repository/`.

## Módulos del proyecto

Ver detalles en:
- @.claude/rules/typescript.md
- @.claude/rules/supabase.md
- @.claude/rules/react.md
- @.claude/rules/tailwind.md
- @.claude/rules/git.md
