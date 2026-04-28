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
                bgColor="bg-primary-900"
                buttonText="Nueva tarea"
                textColor="text-tertiary-50"
                iconColor="text-primary-900"
                buttonColor="bg-tertiary-300"
                icon={<Plus />}
            />
            <ModalCreateTask show={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
}
