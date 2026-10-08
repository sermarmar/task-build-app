import { Activity, Award, ListTodo, Timer } from "lucide-react";
import { StatTile } from "@/app/components/ux/StatTile";
import { useTaskBoardContext } from "@/app/features/tasks/contexts/useTaskBoardContext";
import { useHabitBoardContext } from "@/app/features/habits/contexts/useHabitBoardContext";
import { usePomodoroStore } from "@/app/features/pomodoro/stores/usePomodoreStore";
import type { ActivityGrid } from "@/app/features/map-activities/models/MapActivity";
import { percent, SummaryStatsService } from "../services/SummaryStatsService";

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
            <StatTile
                icon={<ListTodo />}
                label="Tareas pendientes"
                value={stats.tasks.pending}
                hint={`${stats.tasks.completed} de ${stats.tasks.total} completadas`}
                tone="peach"
                progress={percent(stats.tasks.completed, stats.tasks.total)}
                isLoading={tasksLoading}
            />
            <StatTile
                icon={<Award />}
                label="Hábitos de hoy"
                value={`${stats.habits.completed}/${stats.habits.total}`}
                hint={`${percent(stats.habits.completed, stats.habits.total)}% del día cumplido`}
                tone="blue"
                progress={percent(stats.habits.completed, stats.habits.total)}
                isLoading={habitsLoading}
            />
            <StatTile
                icon={<Timer />}
                label="Pomodoros"
                value={stats.pomodoros.completed}
                hint={`Objetivo diario: ${stats.pomodoros.goal}`}
                tone="lilac"
                progress={percent(stats.pomodoros.completed, stats.pomodoros.goal)}
            />
            <StatTile
                icon={<Activity />}
                label="Actividades"
                value={stats.activities.total}
                hint={`${stats.activities.activeDays} días activos este año`}
                tone="rose"
                progress={percent(stats.activities.activeDays, stats.activities.days)}
                isLoading={gridLoading}
            />
        </div>
    );
};
