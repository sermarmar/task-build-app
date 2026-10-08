-- Datos de salud física y mental del usuario (1:1 con profiles).
-- Tabla separada de profiles porque profiles se lee antes del login (búsqueda por username)
-- y estos datos son sensibles: solo el propio usuario puede verlos o modificarlos.

create table public.health_profiles (
    user_id              uuid primary key references public.profiles(id) on delete cascade,
    height_cm            numeric(4,1) check (height_cm between 50 and 260),
    weight_kg            numeric(5,1) check (weight_kg between 20 and 400),
    target_weight_kg     numeric(5,1) check (target_weight_kg between 20 and 400),
    sex                  text check (sex in ('female', 'male', 'other')),
    activity_level       text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    sleep_goal_hours     numeric(3,1) check (sleep_goal_hours between 3 and 14),
    bedtime              time,
    wake_time            time,
    water_goal_liters    numeric(3,1) check (water_goal_liters between 0.5 and 8),
    stress_level         smallint check (stress_level between 1 and 5),
    energy_level         smallint check (energy_level between 1 and 5),
    practices_meditation boolean not null default false,
    attends_therapy      boolean not null default false,
    created_at           timestamptz not null default now(),
    updated_at           timestamptz not null default now()
);

alter table public.health_profiles enable row level security;

create policy "health_profiles_select_own" on public.health_profiles
    for select to authenticated
    using ((select auth.uid()) = user_id);

create policy "health_profiles_insert_own" on public.health_profiles
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "health_profiles_update_own" on public.health_profiles
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
