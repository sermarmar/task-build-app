import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card, CardTitle } from "../../../components/ux/Card";
import { Input } from "../../../components/ux/Input";
import { Select } from "../../../components/ux/Select";
import { TextareaDynamic } from "../../../components/ux/TextareaDynamic";
import { Button } from "../../../components/ux/Button";
import { CATEGORIAS, ESTADOS } from "../../../shared/constants";

interface ModalCreateTaskProps {
    show: boolean;
    onClose: () => void;
}

export const ModalCreateTask: React.FC<ModalCreateTaskProps> = ({ show, onClose }) => {

    // keep mounted to allow exit animation
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    if (!visible) return null;

    return (
        <div
            id="modal-create-task"
            tabIndex={-1}
            className={`fixed inset-0 z-50 flex items-center justify-center -top-50 transition-all duration-300 ${
                show ? "backdrop-blur-sm opacity-100" : "backdrop-blur-none opacity-0"
            }`}
        >
            <Card
                className={`relative p-4 w-300 mx-auto mt-20 transform transition-all duration-300 ${
                    show ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}/* prevent closing when clicking inside */
            >
                <CardTitle className="flex justify-between items-center">
                    Crear nueva tarea
                    <X className="cursor-pointer" onClick={onClose} />
                </CardTitle>
                <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-3 gap-5 mt-4">
                    <Input type="text" placeholder="Escribe un título para la tarea" className="w-full col-span-3 mb-4 text-2xl" />
                    <div className="col-span-2">
                        <TextareaDynamic label="Descripción" />
                    </div>
                    <div>
                        <Select name="state" label="Estado" list={ ESTADOS.map(s => s.name) } onChange={() => {}} className="mb-4"/>
                        <Select name="category" label="Categoría" list={ CATEGORIAS.map(c => c.label) } onChange={() => {}} className="mb-4"/>
                        <div className="flex justify-end items-end h-53">
                            <Button type="submit" color="primary" className="justify-center">Crear tarea</Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}