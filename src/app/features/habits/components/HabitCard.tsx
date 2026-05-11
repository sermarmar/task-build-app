import { useEffect, useState } from "react";
import type { Habit } from "../models/Habit";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { toLocalDateString } from "../helpers/daysHelpers";
import { CompleteHabitService } from "../services/CompleteHabitService";
import { DeleteHabitService } from "../services/DeleteHabitService";
import { Checkbox } from "../../../components/ux/Checkbox";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import { useColorAlpha } from "../../../hooks/useColorAlpha";
import { Pencil, Trash2 } from "lucide-react";

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    showButton?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, showButton = true }) => {

    const [checked, setChecked] = useState<boolean>(isCompleted);
    const { selectedDate, openModal, refreshHabits } = useHabitBoardContext();

    useEffect(() => {
        setChecked(isCompleted);
    }, [isCompleted]);

    const handleHabitCompleted = (isChecked: boolean) => {
        setChecked(isChecked);
        CompleteHabitService.execute(habit.id!, toLocalDateString(selectedDate), isChecked);
    }

    const handleDelete = async () => {
        const { error } = await DeleteHabitService.delete(habit.id!);
        if (!error) {
            refreshHabits(true);
        }
    }

    return (
        <div className="flex gap-4 items-center justify-between p-2 rounded-md border-l-5 border-tertiary-200 bg-tertiary-600/45 w-full"
            style={{
                backgroundColor: useColorAlpha(habit.categories?.group?.color ?? '#1d5f47', 0.2),
                borderColor: habit.categories?.group?.color ?? '#1d5f47',
            }}>
            <div className="flex gap-4 items-center">
                <span className="text-tertiary-50 w-10 h-10 flex items-center justify-center rounded-full"
                    style={{
                        backgroundColor: habit.categories?.group?.color ?? '#1d5f47',
                    }}>
                    <DynamicIcon name={habit.categories?.icon ?? 'Star'} />
                </span>
                <h3 className="text-sm font-medium">{habit.title}</h3>
            </div>

            <div className="flex gap-4 items-center">
                <Checkbox value={habit.id} onChange={(isChecked) => handleHabitCompleted(isChecked)} checked={checked} />
                {showButton && (
                    <>
                        <button className="text-secondary-700 cursor-pointer hover:text-secondary-500 transition-colors" onClick={() => openModal(true, true, habit)}>
                            <Pencil size={16} />
                        </button>
                        <button className="text-secondary-700 cursor-pointer hover:text-red-400 transition-colors" onClick={handleDelete}>
                            <Trash2 size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}