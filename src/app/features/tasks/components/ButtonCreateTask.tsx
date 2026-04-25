import { Plus } from "lucide-react";
import { ModalCreateTask } from "./ModalCreateTask";
import { useState } from "react";

export const ButtonCreateTask: React.FC = () => {

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <button 
            className="w-full bg-primary-900 flex items-center justify-between rounded-full p-2 pl-10"
            onClick={() => setOpenModal(true)}>
                <span className="text-lg text-tertiary-50 font-semibold">Nueva tarea</span>
                <span className="bg-tertiary-300 text-primary-900 rounded-full p-5 cursor-pointer">
                    <Plus />
                </span>
            </button>
            <ModalCreateTask show={openModal} onClose={() => setOpenModal(false)}/>
        </>
    );
}
