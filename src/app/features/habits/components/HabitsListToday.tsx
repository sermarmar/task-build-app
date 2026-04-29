import { useEffect, useState } from "react";
import { RetrieveHabitsService } from "../services/RetrieveHabitsService";
import type { Habit } from "../models/Habit";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import { useColorAlpha } from "../../../hooks/useColorAlpha";
import { Card } from "../../../components/ux/Card";

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
                        <div className="flex gap-4 items-center p-4 rounded-md border-l-5 border-tertiary-200 bg-tertiary-600/45 w-full"
                            style={{
                                backgroundColor: useColorAlpha(habit.categories?.color, 0.2),
                                borderColor: habit.categories?.color,
                            }}>
                            <span className="text-tertiary-50 w-10 h-10 flex items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: habit.categories?.color,
                                }}>
                                <DynamicIcon name={habit.categories?.icon} />
                            </span>
                            <h3 className="text-md font-medium">{habit.title}</h3>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        
    );

}