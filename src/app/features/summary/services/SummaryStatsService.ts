import type { Task } from "@/app/features/tasks/models/Task";
import type { Habit } from "@/app/features/habits/models/Habit";
import type { HabitLog } from "@/app/features/habits/models/HabitLog";
import type { ActivityGrid } from "@/app/features/map-activities/models/MapActivity";
import { toLocalDateString } from "@/app/features/habits/helpers/daysHelpers";

export const POMODORO_DAILY_GOAL = 8;

export interface SummaryStats {
    tasks: { pending: number; completed: number; total: number };
    habits: { completed: number; total: number };
    pomodoros: { completed: number; goal: number };
    activities: { total: number; activeDays: number; days: number };
}

interface SummaryInput {
    tasks: Task[];
    habits: Habit[];
    habitLogs: HabitLog[];
    date: Date;
    completedPomodoros: number;
    grid: ActivityGrid | null;
}

const normalize = (s: string) => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const percent = (part: number, total: number) => total > 0 ? Math.round((part / total) * 100) : 0;

export const SummaryStatsService = {

    getStats: ({ tasks, habits, habitLogs, date, completedPomodoros, grid }: SummaryInput): SummaryStats => {
        const statusOf = (t: Task) => normalize(t.status?.name ?? '');
        const activeTasks = tasks.filter(t => statusOf(t) !== 'CANCELADA');
        const completedTasks = activeTasks.filter(t => statusOf(t) === 'COMPLETADA').length;

        const dateStr = toLocalDateString(date);
        const completedHabits = habits.filter(h =>
            habitLogs.some(log => log.habit_id === h.id && (log.completed_at as unknown as string) === dateStr)
        ).length;

        const days = grid?.weeks.flatMap(w => w.days).filter(d => d !== null) ?? [];

        return {
            tasks: { pending: activeTasks.length - completedTasks, completed: completedTasks, total: activeTasks.length },
            habits: { completed: completedHabits, total: habits.length },
            pomodoros: { completed: completedPomodoros, goal: POMODORO_DAILY_GOAL },
            activities: {
                total: grid?.totalCount ?? 0,
                activeDays: days.filter(d => d.count > 0).length,
                days: days.length,
            },
        };
    },

};
