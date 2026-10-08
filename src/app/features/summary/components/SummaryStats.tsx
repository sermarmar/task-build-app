import { Activity, Award, ListTodo, Timer } from "lucide-react";
import { useTaskBoardContext } from "@/app/features/tasks/contexts/useTaskBoardContext";
import { useHabitBoardContext } from "@/app/features/habits/contexts/useHabitBoardContext";
import { usePomodoroStore } from "@/app/features/pomodoro/stores/usePomodoreStore";
import type { ActivityGrid } from "@/app/features/map-activities/models/MapActivity";
import { percent, SummaryStatsService } from "../services/SummaryStatsService";
import { StatCard } from "./StatCard";

interface SummaryStatsProps {
    grid: ActivityGrid | null;
    gridLoading: boolean;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ grid, gridLoading }) => {
    const { tasks, isLoading: tasksLoading } = useTaskBoardContext();
    const { habits, habitLogs, selectedDate, isLoading: habitsLoading } = useHabitBoardContext();
    const completedPomodoros = usePomodoroStore(state => state.completedWork);

    const stats = SummaryStatsService.getStats({
        tasks, habits, habitLogs, grid,
        date: selectedDate,
        completedPomodoros,
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
                icon={<ListTodo />}
                value={stats.tasks.pending}
                label="Tareas pendientes"
                hint={`${stats.tasks.completed} de ${stats.tasks.total} completadas`}
                progress={percent(stats.tasks.completed, stats.tasks.total)}
                color="var(--color-tertiary-500)"
                isLoading={tasksLoading}
            />
            <StatCard
                icon={<Award />}
                value={`${stats.habits.completed}/${stats.habits.total}`}
                label="Hábitos de hoy"
                hint={`${percent(stats.habits.completed, stats.habits.total)}% del día cumplido`}
                progress={percent(stats.habits.completed, stats.habits.total)}
                color="var(--color-secondary-500)"
                isLoading={habitsLoading}
            />
            <StatCard
                icon={<Timer />}
                value={stats.pomodoros.completed}
                label="Pomodoros"
                hint={`Objetivo diario: ${stats.pomodoros.goal}`}
                progress={percent(stats.pomodoros.completed, stats.pomodoros.goal)}
                color="var(--color-lilac-500)"
            />
            <StatCard
                icon={<Activity />}
                value={stats.activities.total}
                label="Actividades"
                hint={`${stats.activities.activeDays} días activos este año`}
                progress={percent(stats.activities.activeDays, stats.activities.days)}
                color="var(--color-accent-blossom-500)"
                isLoading={gridLoading}
            />
        </div>
    );
};
