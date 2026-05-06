import { useEffect, useState } from "react";
import type { Habit } from "../models/Habit";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { CompleteHabitService } from "../services/CompleteHabitService";
import { Checkbox } from "../../../components/ux/Checkbox";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import { useColorAlpha } from "../../../hooks/useColorAlpha";

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted }) => {

    const [checked, setChecked] = useState<boolean>(isCompleted);
    const { selectedDate } = useHabitBoardContext();

    useEffect(() => {
        setChecked(isCompleted);
    }, [isCompleted]);

    const handleHabitCompleted = (isChecked: boolean) => {
        // Aquí puedes agregar la lógica para marcar el hábito como completado o no
        setChecked(isChecked);
        // habit.id siempre existe cuando llega desde la base de datos
        CompleteHabitService.execute(habit.id!, selectedDate.toISOString().split('T')[0], isChecked);
    }

    return (
        <div className="flex gap-4 items-center justify-between p-2 rounded-md border-l-5 border-tertiary-200 bg-tertiary-600/45 w-full"
            style={{
                backgroundColor: useColorAlpha(habit.categories?.color ?? '#1d5f47', 0.2),
                borderColor: habit.categories?.color ?? '#1d5f47',
            }}>
            <div className="flex gap-4 items-center">
                <span className="text-tertiary-50 w-10 h-10 flex items-center justify-center rounded-full"
                    style={{
                        backgroundColor: habit.categories?.color ?? '#1d5f47',
                    }}>
                    <DynamicIcon name={habit.categories?.icon ?? 'Star'} />
                </span>
                <h3 className="text-sm font-medium">{habit.title}</h3>
            </div>
            
            <Checkbox value={habit.id} onChange={(isChecked) => handleHabitCompleted(isChecked)} checked={checked} />
        </div>
    );
}