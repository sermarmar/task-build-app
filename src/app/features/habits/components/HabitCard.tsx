import { useEffect, useState } from "react";
import { Card } from "../../../components/ux/Card";
import { Checkbox } from "../../../components/ux/Checkbox";
import type { Habit } from "../models/Habit";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { CompleteHabitService } from "../services/CompleteHabitService";

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
        CompleteHabitService.execute(habit.id, selectedDate.toISOString().split('T')[0], isChecked);
    }

    return (
        <Card>
            <div className="flex items-center">
                <Checkbox
                    value={habit.id}
                    label={habit.title}
                    checked={checked} onChange={() => handleHabitCompleted(!checked)}
                />
            </div>
        </Card>
    );
}