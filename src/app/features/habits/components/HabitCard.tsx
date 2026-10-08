import { useEffect, useState } from "react";
import type { Habit } from "../models/Habit";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { toLocalDateString } from "../helpers/daysHelpers";
import { CompleteHabitService } from "../services/CompleteHabitService";
import { DeleteHabitService } from "../services/DeleteHabitService";
import { Checkbox } from "../../../components/ux/Checkbox";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import { useColorAlpha } from "../../../hooks/useColorAlpha";
import { Pencil, Trash2, X } from "lucide-react";
import { useNotification } from "../../../contexts/notification/useNotification";
import { cn } from "@/utils/cn";

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    showButton?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, showButton = true }) => {

    const [checked, setChecked] = useState<boolean>(isCompleted);
    const { selectedDate, openModal, refreshHabits } = useHabitBoardContext();
    const { notify } = useNotification();
    const color = habit.categories?.group?.color ?? '#9580b5';
    const tint = useColorAlpha(color, 0.16);

    useEffect(() => {
        setChecked(isCompleted);
    }, [isCompleted]);

    const handleHabitCompleted = async (isChecked: boolean) => {
        setChecked(isChecked);
        try {
            await CompleteHabitService.execute(habit.id!, toLocalDateString(selectedDate), isChecked);
        } catch {
            setChecked(!isChecked);
            notify(<><X /><span>No se pudo guardar el hábito.</span></>, 'danger');
        }
    }

    const handleDelete = async () => {
        const { error } = await DeleteHabitService.delete(habit.id!);
        if (!error) {
            refreshHabits(true);
        }
    }

    return (
        <div className="group flex gap-3 items-center justify-between p-2.5 pr-4 rounded-2xl bg-white/70 shadow-clay-sm text-primary-950">
            <div className="flex gap-3 items-center min-w-0">
                <span
                    className="size-10 flex items-center justify-center rounded-xl shrink-0 [&_svg]:size-5"
                    style={{ backgroundColor: tint, color }}
                >
                    <DynamicIcon name={habit.categories?.icon ?? 'Star'} />
                </span>
                <div className="min-w-0">
                    <h3 className={cn("text-sm font-bold truncate transition-colors", checked && "line-through text-primary-400")}>
                        {habit.title}
                    </h3>
                    {habit.categories?.name && (
                        <p className="text-xs text-primary-400 truncate">{habit.categories.name}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-3 items-center shrink-0">
                {showButton && (
                    <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                            type="button"
                            aria-label="Editar hábito"
                            className="text-primary-400 cursor-pointer hover:text-secondary-600 transition-colors"
                            onClick={() => openModal(true, true, habit)}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            type="button"
                            aria-label="Eliminar hábito"
                            className="text-primary-400 cursor-pointer hover:text-accent-blossom-600 transition-colors"
                            onClick={handleDelete}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
                <Checkbox value={habit.id} onChange={(isChecked) => handleHabitCompleted(isChecked)} checked={checked} size="lg" />
            </div>
        </div>
    );
}
