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
                bgColor="primary-900"
                buttonText="Nueva tarea"
                textColor="tertiary-50"
                iconColor="primary-900"
                buttonColor="tertiary-300"
                icon={<Plus />}
            />
            <ModalCreateTask show={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
}
