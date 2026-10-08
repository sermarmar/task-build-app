import { Plus } from "lucide-react";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { ButtonWithIcon } from "../../../components/ux/ButtonWithIcon";

export const ButtonCreateHabit: React.FC = () => {

    const { openModal } = useHabitBoardContext();

    return (
        <ButtonWithIcon
            onClick={() => openModal(true)}
            bgColor="bg-surface"
            buttonText="Nuevo hábito"
            textColor="text-primary-800"
            iconColor="text-secondary-950"
            buttonColor="clay-blue"
            icon={<Plus />}
        />
    );
}
