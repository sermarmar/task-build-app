import { Card } from "../../../components/ux/Card";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { HabitCard } from "./HabitCard";

export const HabitsListToday: React.FC = () => {

    const { habits, habitLogs, error, selectedDate } = useHabitBoardContext();
    
    const isHabitCompleted = (habitId: string): boolean => {
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        return habitLogs.some(log => {
            const logDateStr = new Date(log.completed_at).toISOString().split('T')[0];
            return log.habit_id === habitId && logDateStr === selectedDateStr;
        });
    }


    return (
        <div className="max-h-full flex flex-col">
            <h3 className="text-lg font-medium ml-4 mb-2">Hábitos para hoy</h3>
            <Card>
                {error && <div className="error">{error}</div>}
                {
                    habits.length === 0 && !error && 
                    <div className='text-gray-400 font-bold text-5xl text-center mt-5'>No hay hábitos disponibles</div>
                }
                <div className="h-65 grid grid-cols-1 gap-4 overflow-y-auto overflow-x-hidden">
                    {habits
                    .map(habit => (
                        <HabitCard habit={habit} isCompleted={isHabitCompleted(habit.id!)} />
                    ))}
                </div>
            </Card>
        </div>
        
    );

}