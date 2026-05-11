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
import { EditTaskService } from "../services/EditTaskService";
import { Controller, useForm } from "react-hook-form";
import type { TaskResponse } from "../resource/TaskResponse";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import { StatusService } from "../../../core/service/status/StatusService";
import { useNotification } from "../../../contexts/notification/useNotification";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";
import type { Task } from "../models/Task";

interface ModalCreateTaskProps {
    show: boolean;
    onClose: () => void;
    task?: Task | null;
}

export const ModalCreateTask: React.FC<ModalCreateTaskProps> = ({ show, onClose, task }) => {

    const isEditMode = !!task;
    const [visible, setVisible] = useState(show);
    const { notify } = useNotification();
    const { refreshTasks } = useTaskBoardContext();

    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm<TaskResponse>({
        defaultValues: { title: '', description: '', points: 0, category_id: '', status_id: undefined }
    });

    const watchedCategoryId = watch('category_id');
    const watchedStatusId = watch('status_id');

    useEffect(() => {
        if (!show) {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }

        setVisible(true);

        if (isEditMode) {
            reset({
                title: task.title,
                description: task.description,
                points: task.points,
                category_id: task.category?.id ?? '',
                status_id: task.status?.id,
            });
            return;
        }

        CategoryService.getFirstCategory().then((res) => {
            setValue('category_id', res.category?.id ?? '');
        });
        StatusService.getFirstStatus().then((res) => {
            setValue('status_id', res.status?.id ?? 1);
        });
    }, [show]);

    if (!visible) return null;

    const handleSubmitForm = async (form: TaskResponse) => {
        if (isEditMode) {
            const { error } = await EditTaskService.update(task.id!, form);
            if (error) {
                notifyMessage("danger", "Ha fallado al editar la tarea.", <X />);
            } else {
                notifyMessage("success", "Tarea editada correctamente.", <Check />);
                refreshTasks(true);
                onClose();
            }
        } else {
            const { error } = await CreateTaskService.create(form);
            if (error) {
                notifyMessage("danger", "Ha fallado al crear la tarea.", <X />);
            } else {
                notifyMessage("success", "Tarea creada correctamente.", <Check />);
                refreshTasks(true);
                onClose();
            }
        }
    };

    const notifyMessage = (type: "success" | "danger", message: string, icon?: React.ReactElement) => {
        notify(<>{ icon }<span>{ message }</span></>, type);
    };

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
                }`}
            >
                <CardTitle className="flex justify-between items-center">
                    {isEditMode ? 'Editar tarea' : 'Crear nueva tarea'}
                    <X className="cursor-pointer" onClick={onClose} />
                </CardTitle>
                <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-3 gap-5 mt-4">
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
                            defaultValue={isEditMode ? task.description : undefined}
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

                        <SelectCategory
                            value={watchedCategoryId}
                            onChange={(c) => c && setValue('category_id', c.id)}
                        />
                        <SelectStatus
                            value={watchedStatusId}
                            onChange={(s) => setValue('status_id', s.id)}
                        />
                        <div className="flex justify-end items-end h-53">
                            <Button type="submit" color="primary" className="justify-center">
                                {isEditMode ? 'Guardar cambios' : 'Crear tarea'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}
