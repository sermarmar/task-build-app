import { Award } from "lucide-react";
import { Card } from "../../../components/ux/Card";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { toLocalDateString } from "../helpers/daysHelpers";
import { HabitCard } from "./HabitCard";
import { ScrollFadeContainer } from "../../../components/ux/ScrollFadeContainer";

export const HabitsListToday: React.FC = () => {

    const { habits, habitLogs, error, selectedDate } = useHabitBoardContext();

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

    return (
        <Card tabTitle={tabTitle} tabSubtitle={`${habits.length} programados para hoy`} className="flex flex-col min-h-0">
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
        </Card>
    );

}
