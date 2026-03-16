import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card, CardTitle } from "../../../components/ux/Card";
import { Input } from "../../../components/ux/Input";
import { TextareaDynamic } from "../../../components/ux/TextareaDynamic";
import { Button } from "../../../components/ux/Button";
import { Stars } from "../../../components/ux/Stars";
import { SelectCategory } from "../../../components/template/category/SelectCategory";
import { SelectStatus } from "../../../components/template/status/SelectStatus";
import { CreateTaskService } from "../services/CreateTaskService";
import type { Task } from "../models/Task";

interface ModalCreateTaskProps {
    show: boolean;
    onClose: () => void;
}

export const ModalCreateTask: React.FC<ModalCreateTaskProps> = ({ show, onClose }) => {

    // keep mounted to allow exit animation
    const [visible, setVisible] = useState(show);
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState(0);
    const [description, setDescription] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [status_id, setStatusId] = useState('');

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    if (!visible) return null;

    const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const task: Task = {
            title,
            description,
            points,
            category_id,
            status_id
        };

        const response = await CreateTaskService.create(task);

        if (response.error) {
            alert("Error al crear la tarea")
        } else {
            onClose();
        }
    }

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
                <form onSubmit={ handleCreateTask } className="grid grid-cols-3 gap-5 mt-4">
                    <Input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Escribe un título para la tarea" className="w-full col-span-3 mb-4 text-2xl" />
                    <div className="col-span-2">
                        <TextareaDynamic label="Descripción" onChange={(value) => setDescription(value)}/>
                    </div>
                    <div>
                        <Stars points={points} onChange={setPoints} className="mb-4" />
                        <SelectCategory onChange={(c) => setCategoryId(c.id)}/>
                        <SelectStatus onChange={(s) => setStatusId(s.id)}/>
                        <div className="flex justify-end items-end h-53">
                            <Button type="submit" color="primary" className="justify-center">Crear tarea</Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}