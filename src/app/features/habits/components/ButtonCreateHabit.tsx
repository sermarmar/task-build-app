import { Plus } from "lucide-react";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";

export const ButtonCreateHabit: React.FC = () => {

    const { openModal } = useHabitBoardContext();

    return (
        <>
            <button 
            className="w-full bg-tertiary-300 flex items-center justify-between rounded-full p-2 pl-10"
            onClick={() => openModal(true)}>
                <span className="text-lg text-primary-900 font-semibold">Nuevo hábito</span>
                <span className="bg-primary-900 text-tertiary-50 rounded-full p-5 cursor-pointer">
                    <Plus />
                </span>
            </button>
        </>
    );
}
