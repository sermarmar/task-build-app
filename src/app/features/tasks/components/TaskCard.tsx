import { Check, Pencil, Trash2, X } from 'lucide-react';
import { DynamicIcon } from '../../../components/ux/DynamicIcon';
import { useColorAlpha } from '../../../hooks/useColorAlpha';
import { DeleteTaskService } from '../services/DeleteTaskService';
import { useTaskBoardContext } from '../contexts/useTaskBoardContext';
import { useNotification } from '../../../contexts/notification/useNotification';
import type { Task } from '../models/Task';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const color = task.category?.group?.color ?? '#6b7280';
    const bg = useColorAlpha(color, 0.2);
    const { refreshTasks, openEditModal } = useTaskBoardContext();
    const { notify } = useNotification();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id! });

    const handleDelete = async () => {
        const { error } = await DeleteTaskService.delete(task.id!);
        if (error) {
            notify(<><X /><span>No se pudo eliminar la tarea.</span></>, 'danger');
        } else {
            refreshTasks();
            notify(<><Check /><span>Tarea eliminada correctamente.</span></>, 'success');
        }
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`flex gap-4 items-center justify-between p-2 rounded-md border-l-5 w-full cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-40' : ''}`}
            style={{ backgroundColor: bg, borderColor: color, transform: CSS.Translate.toString(transform) }}
        >
            <div className="flex gap-4 items-center">
                <span
                    className="text-white w-10 h-10 flex items-center justify-center rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                >
                    <DynamicIcon name={task.category?.icon ?? 'ClipboardList'} />
                </span>
                <div className="flex flex-col">
                    <h3 className="text-sm font-medium">{task.title}</h3>
                    <h5 className="text-[12px] text-primary-900/80">{task.category?.name}</h5>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <button
                    className="text-secondary-700 cursor-pointer hover:text-secondary-500 transition-colors"
                    onClick={() => openEditModal(task)}
                >
                    <Pencil size={16} />
                </button>
                <button
                    className="text-secondary-700 cursor-pointer hover:text-red-400 transition-colors"
                    onClick={handleDelete}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
