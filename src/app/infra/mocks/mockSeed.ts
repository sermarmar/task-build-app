import type { Status } from '@/app/core/models/Status';
import type { User } from '@/app/features/login/model/User';
import { DAY_NAMES, toLocalDateString } from '@/app/features/habits/helpers/daysHelpers';
import type { CategoryRow, GroupRow, HabitLogRow, HabitRow, MockDb, TaskRow } from '@/app/infra/mocks/mockDb';

export const MOCK_USER: User = {
    id: 'mock-user',
    username: 'demo',
    email: 'demo@task-build.dev',
    name: 'Demo',
    lastName: 'Usuario',
    birthDate: '1995-06-15',
};

const HISTORY_DAYS = 150;
const COMPLETED_STATUS_ID = 5;

const daysAgo = (days: number, hour = 12): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, 0, 0, 0);
    return date;
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(items: T[]): T => items[randomInt(0, items.length - 1)];

// Fecha fija (y no calculada) para que el tree-shaking elimine el seed entero del bundle de producción
const SEED_DATE = '2026-01-01T00:00:00.000Z';

let seedCounter = 0;
const mockSeedId = (prefix: string) => `${prefix}-${++seedCounter}`;

const groups: GroupRow[] = [
    { id: 'grp-salud',         name: 'Salud',         color: '#4fa38a', created_at: SEED_DATE },
    { id: 'grp-productividad', name: 'Productividad', color: '#3e7fb5', created_at: SEED_DATE },
    { id: 'grp-bienestar',     name: 'Bienestar',     color: '#b57be8', created_at: SEED_DATE },
    { id: 'grp-hogar',         name: 'Hogar',         color: '#e8a535', created_at: SEED_DATE },
    { id: 'grp-social',        name: 'Social',        color: '#e84fa3', created_at: SEED_DATE },
    { id: 'grp-aprendizaje',   name: 'Aprendizaje',   color: '#e85d35', created_at: SEED_DATE },
    { id: 'grp-ocio',          name: 'Ocio',          color: '#22c55e', created_at: SEED_DATE },
];

const categories: CategoryRow[] = [
    { id: 'cat-ejercicio',    name: 'Ejercicio',    description: 'Entrenamientos y deporte', icon: 'Dumbbell',      group_id: 'grp-salud',         created_at: SEED_DATE },
    { id: 'cat-alimentacion', name: 'Alimentación', description: 'Comer sano',               icon: 'Apple',         group_id: 'grp-salud',         created_at: SEED_DATE },
    { id: 'cat-trabajo',      name: 'Trabajo',      description: 'Proyectos y reuniones',    icon: 'Laptop',        group_id: 'grp-productividad', created_at: SEED_DATE },
    { id: 'cat-metas',        name: 'Metas',        description: 'Objetivos personales',     icon: 'Target',        group_id: 'grp-productividad', created_at: SEED_DATE },
    { id: 'cat-meditacion',   name: 'Meditación',   description: 'Mindfulness y calma',      icon: 'Brain',         group_id: 'grp-bienestar',     created_at: SEED_DATE },
    { id: 'cat-limpieza',     name: 'Limpieza',     description: 'Tareas de casa',           icon: 'Brush',         group_id: 'grp-hogar',         created_at: SEED_DATE },
    { id: 'cat-familia',      name: 'Familia',      description: 'Tiempo con la familia',    icon: 'Users',         group_id: 'grp-social',        created_at: SEED_DATE },
    { id: 'cat-lectura',      name: 'Lectura',      description: 'Libros y artículos',       icon: 'BookOpen',      group_id: 'grp-aprendizaje',   created_at: SEED_DATE },
    { id: 'cat-estudio',      name: 'Estudio',      description: 'Cursos y formación',       icon: 'GraduationCap', group_id: 'grp-aprendizaje',   created_at: SEED_DATE },
    { id: 'cat-musica',       name: 'Música',       description: 'Tocar y escuchar música',  icon: 'Music',         group_id: 'grp-ocio',          created_at: SEED_DATE },
];

const statuses: Status[] = [
    { id: 1, name: 'Pendiente',   description: 'Tarea por empezar',      color: '#555555', created_at: SEED_DATE },
    { id: 2, name: 'En progreso', description: 'Tarea en curso',         color: '#3e7fb5', created_at: SEED_DATE },
    { id: 3, name: 'Bloqueada',   description: 'Esperando a algo',       color: '#e85d35', created_at: SEED_DATE },
    { id: 4, name: 'En revisión', description: 'Pendiente de revisar',   color: '#e8a535', created_at: SEED_DATE },
    { id: 5, name: 'Completada',  description: 'Tarea terminada',        color: '#4fa38a', created_at: SEED_DATE },
    { id: 6, name: 'Cancelada',   description: 'Tarea descartada',       color: '#444444', created_at: SEED_DATE },
];

const buildTask = (
    title: string,
    description: string,
    categoryId: string,
    statusId: number,
    points: number,
    priority: string,
    createdAt: Date,
    completedAt: Date | null = null,
): TaskRow => ({
    id: mockSeedId('task'),
    title,
    description,
    category_id: categoryId,
    status_id: statusId,
    points,
    priority,
    created_at: createdAt.toISOString(),
    updated_at: (completedAt ?? createdAt).toISOString(),
    completed_at: completedAt?.toISOString() ?? null,
});

const COMPLETED_TASK_POOL: [string, string][] = [
    ['Enviar informe semanal', 'cat-trabajo'],
    ['Reunión con el equipo de diseño', 'cat-trabajo'],
    ['Actualizar dependencias del proyecto', 'cat-trabajo'],
    ['Hacer la compra', 'cat-alimentacion'],
    ['Cocinar batch cooking del domingo', 'cat-alimentacion'],
    ['Rutina de piernas', 'cat-ejercicio'],
    ['Clase de spinning', 'cat-ejercicio'],
    ['Limpiar la cocina a fondo', 'cat-limpieza'],
    ['Poner lavadora y tender', 'cat-limpieza'],
    ['Visitar a los abuelos', 'cat-familia'],
    ['Terminar capítulo del libro', 'cat-lectura'],
    ['Ver lección del curso de React', 'cat-estudio'],
    ['Repasar apuntes de inglés', 'cat-estudio'],
    ['Revisar presupuesto mensual', 'cat-metas'],
    ['Aprender una canción nueva', 'cat-musica'],
    ['Sesión de meditación guiada', 'cat-meditacion'],
];

const createTasks = (): TaskRow[] => {
    const openTasks = [
        buildTask('Preparar presentación del sprint', 'Slides con los resultados de la demo', 'cat-trabajo', 1, 5, 'high', daysAgo(2)),
        buildTask('Revisar PRs pendientes', 'Priorizar los que bloquean al equipo', 'cat-trabajo', 2, 3, 'medium', daysAgo(1)),
        buildTask('Planificar menú semanal', 'Incluir la lista de la compra', 'cat-alimentacion', 1, 2, 'low', daysAgo(3)),
        buildTask('Terminar módulo 3 del curso de TypeScript', 'Genéricos y tipos condicionales', 'cat-estudio', 2, 4, 'medium', daysAgo(5)),
        buildTask('Llamar al seguro del coche', 'Esperando a recibir la póliza', 'cat-metas', 3, 2, 'high', daysAgo(6)),
        buildTask('Limpiar el trastero', 'Separar lo que se dona', 'cat-limpieza', 1, 3, 'low', daysAgo(8)),
        buildTask('Configurar CI del proyecto personal', 'GitHub Actions con tsc y build', 'cat-trabajo', 4, 5, 'high', daysAgo(4)),
        buildTask('Organizar cena familiar', 'Reservar para el sábado', 'cat-familia', 4, 2, 'medium', daysAgo(3)),
        buildTask('Leer "Hábitos atómicos" cap. 5-7', 'Tomar notas de lo importante', 'cat-lectura', 2, 2, 'low', daysAgo(2)),
        buildTask('Practicar escalas en la guitarra', '15 minutos con metrónomo', 'cat-musica', 1, 1, 'low', daysAgo(1)),
    ];

    const cancelledTasks = [
        buildTask('Apuntarse a clases de pádel', 'Horario incompatible', 'cat-ejercicio', 6, 2, 'low', daysAgo(20)),
        buildTask('Migrar blog a otro hosting', 'Ya no hace falta', 'cat-trabajo', 6, 3, 'medium', daysAgo(35)),
    ];

    // Completadas este mes: alimentan la columna "Completada" y el panel de salud mental
    const daysIntoMonth = new Date().getDate() - 1;
    const completedThisMonth = Array.from({ length: 6 }, () => {
        const [title, categoryId] = pick(COMPLETED_TASK_POOL);
        const completedAt = daysAgo(randomInt(0, daysIntoMonth), randomInt(9, 21));
        return buildTask(title, '', categoryId, COMPLETED_STATUS_ID, randomInt(1, 5), pick(['low', 'medium', 'high']), completedAt, completedAt);
    });

    // Histórico: alimenta el mapa de actividad
    const completedHistory = Array.from({ length: 60 }, () => {
        const [title, categoryId] = pick(COMPLETED_TASK_POOL);
        const completedAt = daysAgo(randomInt(daysIntoMonth + 1, HISTORY_DAYS), randomInt(9, 21));
        return buildTask(title, '', categoryId, COMPLETED_STATUS_ID, randomInt(1, 5), pick(['low', 'medium', 'high']), completedAt, completedAt);
    });

    return [...openTasks, ...cancelledTasks, ...completedThisMonth, ...completedHistory];
};

const buildHabit = (
    id: string,
    title: string,
    categoryId: string,
    points: number,
    frequency: HabitRow['frequency'],
    customDays: string[] | null,
    currentStreak: number,
): HabitRow => ({
    id,
    user_id: MOCK_USER.id,
    title,
    description: null,
    category_id: categoryId,
    points,
    frequency,
    custom_days: customDays,
    current_streak: currentStreak,
    is_active: true,
    created_at: SEED_DATE,
    updated_at: SEED_DATE,
});

const habits: HabitRow[] = [
    buildHabit('habit-agua',      'Beber 2L de agua',         'cat-alimentacion', 1, 'daily',  null,                                 12),
    buildHabit('habit-meditar',   'Meditar 10 minutos',       'cat-meditacion',   2, 'daily',  null,                                 5),
    buildHabit('habit-leer',      'Leer 20 páginas',          'cat-lectura',      2, 'daily',  null,                                 8),
    buildHabit('habit-gym',       'Ir al gimnasio',           'cat-ejercicio',    3, 'weekly', ['monday', 'wednesday', 'friday'],    4),
    buildHabit('habit-correr',    'Salir a correr',           'cat-ejercicio',    3, 'weekly', ['tuesday', 'saturday'],              2),
    buildHabit('habit-guitarra',  'Practicar guitarra',       'cat-musica',       2, 'weekly', ['tuesday', 'thursday', 'saturday'],  3),
    buildHabit('habit-limpieza',  'Limpieza general',         'cat-limpieza',     2, 'weekly', ['sunday'],                           3),
    buildHabit('habit-familia',   'Llamar a mis padres',      'cat-familia',      1, 'weekly', ['thursday', 'sunday'],               6),
    buildHabit('habit-finanzas',  'Revisar finanzas del mes', 'cat-metas',        3, 'custom', ['1', '15'],                          1),
];

const isScheduled = (habit: HabitRow, date: Date) =>
    habit.frequency === 'daily' ||
    (habit.custom_days ?? []).some(day => day === DAY_NAMES[date.getDay()].value || day === String(date.getDate()));

const createHabitLogs = (): HabitLogRow[] => {
    const logs: HabitLogRow[] = [];

    for (let days = HISTORY_DAYS; days >= 0; days--) {
        const date = daysAgo(days);
        // Hoy se deja a medias para poder marcar hábitos al probar
        const completionRate = days === 0 ? 0.4 : 0.7;

        habits
            .filter(habit => isScheduled(habit, date) && Math.random() < completionRate)
            .forEach(habit => logs.push({
                id: mockSeedId('log'),
                habit_id: habit.id,
                user_id: MOCK_USER.id,
                completed_at: toLocalDateString(date),
                created_at: date.toISOString(),
            }));
    }

    return logs;
};

export const createSeed = (): MockDb => {
    seedCounter = 0;
    return {
        groups,
        categories,
        statuses,
        tasks: createTasks(),
        habits,
        habitLogs: createHabitLogs(),
        healthProfiles: [{
            user_id: MOCK_USER.id,
            height_cm: 168,
            weight_kg: 63.5,
            target_weight_kg: 60,
            sex: 'female',
            activity_level: 'moderate',
            sleep_goal_hours: 8,
            bedtime: '23:30',
            wake_time: '07:15',
            water_goal_liters: 2,
            stress_level: 3,
            energy_level: 4,
            practices_meditation: true,
            attends_therapy: false,
            created_at: SEED_DATE,
            updated_at: SEED_DATE,
        }],
    };
};
