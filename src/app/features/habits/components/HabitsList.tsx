import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { HabitCard } from "./HabitCard";

interface HabitsListProps {
    showButton?: boolean
}

export const HabitsList: React.FC<HabitsListProps> = ({showButton = true}) => {

    const { habits, habitLogs, error, selectedDate } = useHabitBoardContext();

    const isHabitCompleted = (habitId: string): boolean => {
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        return habitLogs.some(log => {
            const logDateStr = new Date(log.completed_at).toISOString().split('T')[0];
            return log.habit_id === habitId && logDateStr === selectedDateStr;
        });
    }

    return (
        <>
            {error && <div className="error">{error}</div>}
            {
                habits.length === 0 && !error && 
                <div className='text-tertiary-800 font-bold text-5xl text-center mt-5'>No hay hábitos disponibles</div>
            }
            <div className="grid grid-cols-1 gap-4 mt-5">
                {habits
                .map(habit => (
                    <HabitCard key={habit.id!} habit={habit} isCompleted={isHabitCompleted(habit.id!)} showButton={showButton}/>
                ))}
            </div>
        </>
    );

}