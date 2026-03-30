import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardTitle } from "../../../components/ux/Card";
import { Input } from "../../../components/ux/Input";
import { TextareaDynamic } from "../../../components/ux/TextareaDynamic";
import { Button } from "../../../components/ux/Button";
import { Stars } from "../../../components/ux/Stars";
import { SelectCategory } from "../../../components/template/category/SelectCategory";
import { SelectStatus } from "../../../components/template/status/SelectStatus";
import { CreateTaskService } from "../services/CreateTaskService";
import { Controller, useForm } from "react-hook-form";
import type { TaskResponse } from "../resource/TaskResponse";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import type { Category } from "../../../core/models/Category";
import type { Status } from "../../../core/models/Status";
import { StatusService } from "../../../core/service/status/StatusService";
import { useNotification } from "../../../contexts/notification/useNotification";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";

interface ModalCreateTaskProps {
    show: boolean;
    onClose: () => void;
}

export const ModalCreateTask: React.FC<ModalCreateTaskProps> = ({ show, onClose }) => {

    // keep mounted to allow exit animation
    const [visible, setVisible] = useState(show);
    const [category, setCategory] = useState<Category | null>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const { notify } = useNotification();
    const { refreshTasks } = useTaskBoardContext();

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await CategoryService.getFirstCategory();
            setCategory(res.category);
        };
        const fetchStatus = async () => {
            const res = await StatusService.getFirstStatus();
            setStatus(res.status);
        };
        fetchStatus();
        fetchCategory();
    }, []);

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<TaskResponse>({
        defaultValues: {
            title: '',
            description: '',
            points: 0,
            category_id: category ? category.id : '',
            status_id: status ? status.id : undefined
        }
    });

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    if (!visible) return null;

    const handleCreateTask = async (form: TaskResponse) => {
        const response = await CreateTaskService.create(form);

        if (response.error) {
            notifyMessage("danger", "Ha fallado al crear una tarea. Contactá con el administrador.", <X />);
        } else {
            notifyMessage("success", "Se ha creado la tarea correctamente.", <Check />);
            refreshTasks()
            onClose();
        }
    }

    const notifyMessage = (type: "success" | "danger", message: string, icon?: React.ReactElement) => {
        notify(
            <>
                { icon }
                <span>{ message }</span>
            </>,
            type
        )
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
                <form onSubmit={ handleSubmit(handleCreateTask) } className="grid grid-cols-3 gap-5 mt-4">
                    <div className="col-span-3 mb-4">
                        <Input
                            type="text"
                            placeholder="Escribe un título para la tarea"
                            className={`w-full text-2xl ${errors.title ? 'border-red-500' : ''}`}
                            {...register('title', { required: 'El título es obligatorio' })}
                        />
                        {errors.title && (
                            <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>
                        )}
                    </div>
                    <div className="col-span-2">
                        <TextareaDynamic
                            label="Descripción"
                            onChange={(value) => setValue('description', value)}
                        />
                    </div>
                    <div>
                        <div className="mb-4">
                            <Controller
                                name="points"
                                control={control}
                                rules={{ min: { value: 1, message: 'Selecciona al menos 1 punto' } }}
                                render={({ field }) => (
                                    <Stars
                                        points={field.value}
                                        onChange={(value: number) => field.onChange(value)}
                                    />
                                )}
                            />
                            {errors.points && (
                                <span className="text-red-500 text-sm">{errors.points.message}</span>
                            )}
                        </div>
                        
                        <SelectCategory onChange={(c) => setValue('category_id', c.id)}/>
                        <SelectStatus onChange={(s) => setValue('status_id', s.id)}/>
                        <div className="flex justify-end items-end h-53">
                            <Button type="submit" color="primary" className="justify-center">Crear tarea</Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}