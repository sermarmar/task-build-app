import { useAuth } from "../contexts/auth/useAuth";
import { PageHeader } from "../components/template/PageHeader";
import { CalendarBoard } from "../features/calendar/components/CalendarBoard";
import { ButtonCreateHabit } from "../features/habits/components/ButtonCreateHabit";
import { HabitBoardProvider } from "../features/habits/contexts/HabitBoardProvider";
import { ButtonCreateTask } from "../features/tasks/components/ButtonCreateTask";
import { TaskBoardProvider } from "../features/tasks/contexts/TaskBoardProvider";
import { HabitsListToday } from "../features/habits/components/HabitsListToday";
import { MentalHealthBoard } from "../features/mental_healtth/components/MentalHealthBoard";
import { WellbeingAreasBoard } from "../features/mental_healtth/components/WellbeingAreasBoard";
import { useMentalHealth } from "../features/mental_healtth/hooks/useMentalHealth";
import { Pomodoro } from "../features/pomodoro/components/Pomodoro";
import { MapActivitiesBoard } from "../features/map-activities/components/MapActivitiesBoard";
import { useActivityGrid } from "../features/map-activities/hooks/useActivityGrid";
import { SummaryStats } from "../features/summary/components/SummaryStats";

export const DashboardPage: React.FC = () => {

    const { user } = useAuth();
    const { grid, loading: gridLoading } = useActivityGrid();
    const { areas, balance, isLoading: mentalHealthLoading } = useMentalHealth();

    return (
        <TaskBoardProvider>
            <HabitBoardProvider>
                <div className="flex flex-col gap-5 pb-4">
                    <PageHeader
                        title={`¡Hola, ${user?.name ?? ''}!`}
                        subtitle="Mide cómo avanzas cada día con tus tareas, tus hábitos y tu bienestar."
                    />

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <h2 className="font-heading text-2xl font-bold text-primary-950">Resumen</h2>
                        <div className="flex flex-wrap gap-3">
                            <ButtonCreateHabit />
                            <ButtonCreateTask />
                        </div>
                    </div>

                    <SummaryStats grid={grid} gridLoading={gridLoading} />

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                        <div className="xl:col-span-8">
                            <MapActivitiesBoard grid={grid} loading={gridLoading} />
                        </div>
                        <div className="xl:col-span-4">
                            <MentalHealthBoard areas={areas} balance={balance} isLoading={mentalHealthLoading} />
                        </div>

                        <div className="xl:col-span-4">
                            <WellbeingAreasBoard areas={areas} isLoading={mentalHealthLoading} />
                        </div>
                        <div className="xl:col-span-8">
                            <Pomodoro />
                        </div>

                        <div className="xl:col-span-8">
                            {/* Provider propio: elegir un día en el calendario no debe cambiar "Hábitos de hoy" */}
                            <HabitBoardProvider>
                                <CalendarBoard />
                            </HabitBoardProvider>
                        </div>
                        <div className="xl:col-span-4">
                            <HabitsListToday />
                        </div>
                    </div>
                </div>
            </HabitBoardProvider>
        </TaskBoardProvider>
    );
}
