import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card, CardTitle } from '../../ux/Card';
import { Input } from '../../ux/Input';

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
            aria-hidden="true"
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
                show ? "backdrop-blur-sm opacity-100" : "backdrop-blur-none opacity-0"
            }`}
        >
            <Card
                className={`relative p-4 w-300 mx-auto mt-20 transform transition-all duration-300 ${
                    show ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()} /* prevent closing when clicking inside */
            >
                <CardTitle className="flex justify-between items-center">
                    Crear nueva tarea
                    <X className="cursor-pointer" onClick={onClose} />
                </CardTitle>
                <form className="mt-4">
                    <div>
                        <Input type="text" placeholder="Título de la tarea" className="w-full mb-4 text-2xl" />
                        <Input type="textarea" label="Descripción" placeholder="Descripción de la tarea" className="w-full mb-4" />
                    </div>
                </form>
            </Card>
        </div>
    );
}