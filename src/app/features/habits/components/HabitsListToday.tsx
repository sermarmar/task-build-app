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
        <div className="flex gap-2">
            <Award />
            Hábitos para hoy
        </div>
    );

    return (
        <div className="h-full flex flex-col min-h-0">
            <Card tabTitle={tabTitle} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {error && <div className="error">{error}</div>}
                {
                    habits.length === 0 && !error &&
                    <div className='text-gray-400 font-bold text-5xl text-center mt-5'>No hay hábitos disponibles</div>
                }
                <ScrollFadeContainer className="flex-1 min-h-0">
                    <div className="grid grid-cols-1 gap-4 overflow-x-hidden">
                        {habits.map(habit => (
                            <HabitCard key={habit.id} habit={habit} isCompleted={isHabitCompleted(habit.id!)} showButton={false} />
                        ))}
                    </div>
                </ScrollFadeContainer>
            </Card>
        </div>
        
    );

}