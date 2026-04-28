import { Plus } from "lucide-react";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { ButtonWithIcon } from "../../../components/ux/ButtonWithIcon";

export const ButtonCreateHabit: React.FC = () => {

    const { openModal } = useHabitBoardContext();

    return (
        <>
            <ButtonWithIcon 
                onClick={() => openModal(true)}
                bgColor="tertiary-300"
                buttonText="Nuevo hábito"
                textColor="primary-900"
                iconColor="tertiary-50"
                buttonColor="primary-900"
                icon={<Plus />}
            />
        </>
    );
}
