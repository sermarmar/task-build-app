import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { HabitCard } from "./HabitCard";

export const HabitsList: React.FC = () => {

    const { habits, error } = useHabitBoardContext();

    return (
        <>
            {error && <div className="error">{error}</div>}
            {
                habits.length === 0 && !error && 
                <div className='text-gray-400 font-bold text-5xl text-center'>No hay hábitos disponibles</div>
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {habits
                .map(habit => (
                    <HabitCard key={habit.id} habit={habit} />
                ))}
            </div>
        </>
    );

}