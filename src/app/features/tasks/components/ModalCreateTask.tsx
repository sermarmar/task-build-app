import React, { useEffect } from "react";
import { ArrowDown, ArrowUp, Check, Minus, X } from "lucide-react";
import { Modal } from "../../../components/ux/Modal";
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
import { PRIORITY_LEVELS } from "../models/Priority";
import type { PriorityLevel } from "../models/Priority";
import { cn } from "@/utils/cn";

interface ModalCreateTaskProps {
    show: boolean;
    onClose: () => void;
    task?: Task | null;
}

const PRIORITY_ICONS: Record<PriorityLevel, React.ReactElement> = {
    low:    <ArrowDown size={14} />,
    medium: <Minus size={14} />,
    high:   <ArrowUp size={14} />,
};

export const ModalCreateTask: React.FC<ModalCreateTaskProps> = ({ show, onClose, task }) => {

    const isEditMode = !!task;
    const { notify } = useNotification();
    const { refreshTasks } = useTaskBoardContext();

    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm<TaskResponse>({
        defaultValues: { title: '', description: '', points: 0, category_id: '', status_id: undefined, priority: undefined }
    });

    const watchedCategoryId = watch('category_id');
    const watchedStatusId = watch('status_id');
    const watchedPriority = watch('priority');

    useEffect(() => {
        if (!show) return;

        if (isEditMode) {
            reset({
                title: task.title,
                description: task.description,
                points: task.points,
                category_id: task.category?.id ?? '',
                status_id: task.status?.id,
                priority: task.priority?.id,
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
        <Modal
            show={show}
            onClose={onClose}
            title={isEditMode ? 'Editar tarea' : 'Nueva tarea'}
            subtitle="Dale un título claro y decide cuánto esfuerzo te va a llevar."
        >
            <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                    <Input
                        type="text"
                        placeholder="Escribe un título para la tarea"
                        className={cn('text-xl font-bold', errors.title && 'ring-2 ring-accent-blossom-400')}
                        {...register('title', { required: 'El título es obligatorio' })}
                    />
                    {errors.title && (
                        <span className="block text-accent-blossom-700 text-sm font-bold mt-1.5">{errors.title.message}</span>
                    )}
                </div>

                <div className="md:col-span-2">
                    <TextareaDynamic
                        label="Descripción"
                        defaultValue={isEditMode ? task.description : undefined}
                        onChange={(value) => setValue('description', value)}
                    />
                </div>

                <div className="flex flex-col gap-5 rounded-3xl bg-white/40 shadow-clay-inset p-5">
                    <div>
                        <Controller
                            name="points"
                            control={control}
                            rules={{ min: { value: 1, message: 'Selecciona al menos 1 punto' } }}
                            render={({ field }) => (
                                <Stars
                                    label="Puntos de esfuerzo"
                                    points={field.value}
                                    onChange={(value: number) => field.onChange(value)}
                                />
                            )}
                        />
                        {errors.points && (
                            <span className="block text-accent-blossom-700 text-sm font-bold mt-1">{errors.points.message}</span>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-bold text-primary-800 mb-2">Prioridad</p>
                        <div className="flex gap-2">
                            {PRIORITY_LEVELS.map((p) => {
                                const active = watchedPriority === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => setValue('priority', active ? undefined : p.id)}
                                        className={cn(
                                            'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer',
                                            active ? 'text-white shadow-clay-pressed' : 'bg-surface text-primary-500 shadow-clay-sm hover:text-primary-800'
                                        )}
                                        style={active ? { backgroundColor: p.color } : undefined}
                                    >
                                        {PRIORITY_ICONS[p.id]}
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <SelectCategory
                            value={watchedCategoryId}
                            onChange={(c) => c && setValue('category_id', c.id)}
                        />
                    </div>
                    <div>
                        <SelectStatus
                            value={watchedStatusId}
                            onChange={(s) => setValue('status_id', s.id)}
                        />
                    </div>

                    <Button type="submit" color="tertiary" form="rounded" size="lg" className="mt-auto justify-center">
                        {isEditMode ? 'Guardar cambios' : 'Crear tarea'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
