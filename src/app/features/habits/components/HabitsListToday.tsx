import { Award } from "lucide-react";
import { Card } from "../../../components/ux/Card";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { toLocalDateString } from "../helpers/daysHelpers";
import { HabitCard } from "./HabitCard";
import { HabitCardSkeleton } from "./HabitsList";
import { ScrollFadeContainer } from "../../../components/ux/ScrollFadeContainer";

export const HabitsListToday: React.FC = () => {

    const { habits, habitLogs, error, isLoading, selectedDate } = useHabitBoardContext();

    const isHabitCompleted = (habitId: string): boolean => {
        const selectedDateStr = toLocalDateString(selectedDate);
        return habitLogs.some(log => log.habit_id === habitId && (log.completed_at as unknown as string) === selectedDateStr);
    }

    const tabTitle = (
        <>
            <Award />
            Hábitos de hoy
        </>
    );

    const subtitle = isLoading ? 'Cargando hábitos…' : `${habits.length} programados para hoy`;

    return (
        <Card tabTitle={tabTitle} tabSubtitle={subtitle} className="flex flex-col min-h-0">
            {isLoading ? (
                <div className="flex flex-col gap-3 p-1">
                    {Array.from({ length: 4 }).map((_, i) => <HabitCardSkeleton key={i} />)}
                </div>
            ) : (
                <>
                    {error && <p className="text-sm text-accent-blossom-700">{error}</p>}
                    {habits.length === 0 && !error && (
                        <p className="text-primary-400 font-bold text-center py-10">No tienes hábitos para hoy</p>
                    )}
                    <ScrollFadeContainer className="flex-1 min-h-0 max-h-96" fadeColor="var(--color-surface)">
                        <div className="flex flex-col gap-3 p-1">
                            {habits.map(habit => (
                                <HabitCard key={habit.id} habit={habit} isCompleted={isHabitCompleted(habit.id!)} showButton={false} />
                            ))}
                        </div>
                    </ScrollFadeContainer>
                </>
            )}
        </Card>
    );

}
