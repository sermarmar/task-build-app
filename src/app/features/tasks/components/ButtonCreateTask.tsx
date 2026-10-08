import { Plus } from "lucide-react";
import { useState } from "react";
import { ButtonWithIcon } from "../../../components/ux/ButtonWithIcon";
import { ModalCreateTask } from "./ModalCreateTask";

export const ButtonCreateTask: React.FC = () => {

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <ButtonWithIcon
                onClick={() => setOpenModal(true)}
                bgColor="clay-peach shadow-clay-pressed"
                buttonText="Nueva tarea"
                textColor="text-white"
                iconColor="text-tertiary-600"
                buttonColor="clay-knob"
                icon={<Plus />}
            />
            <ModalCreateTask show={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
}
