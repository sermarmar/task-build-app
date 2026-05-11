import { Plus } from "lucide-react";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { ButtonWithIcon } from "../../../components/ux/ButtonWithIcon";

export const ButtonCreateHabit: React.FC = () => {

    const { openModal } = useHabitBoardContext();

    return (
        <>
            <ButtonWithIcon 
                onClick={() => openModal(true)}
                bgColor="bg-tertiary-300"
                buttonText="Nuevo hábito"
                textColor="text-primary-900"
                iconColor="text-tertiary-50"
                buttonColor="bg-primary-900"
                icon={<Plus />}
            />
        </>
    );
}
