import { useEffect, useState } from "react";
import { RetrieveHabitsService } from "../services/RetrieveHabitsService";
import { Bike } from "lucide-react";
import type { Habit } from "../models/Habit";

export const HabitsListToday: React.FC = () => {

    const [habits, setHabits] = useState<Habit[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        RetrieveHabitsService.getHabits(new Date().toLocaleString().split(',')[0].split('/').reverse().join('-').split('-').slice(1)).then(({ habits, error }) => {
            if(error) {
                setError(error.message);
                return;
            }
            setHabits(habits);
        });
    }, []);


    return (
        <>
            {error && <div className="error">{error}</div>}
            {
                habits.length === 0 && !error && 
                <div className='text-gray-400 font-bold text-5xl text-center mt-5'>No hay hábitos disponibles</div>
            }
            <div className="grid grid-cols-1 gap-4">
                {habits
                .map(habit => (
                    <div className="flex gap-4 items-center p-4 rounded-md border-l-5 border-tertiary-200 bg-tertiary-600/45 w-full">
                        <span className="bg-tertiary-300 text-primary-900 w-10 h-10 flex items-center justify-center rounded-full">
                            <Bike />
                        </span>
                        <h3 className="text-md font-medium">{habit.title}</h3>
                    </div>
                ))}
            </div>
        </>
    );

}