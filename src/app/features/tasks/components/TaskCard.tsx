import { ArrowDown, ArrowUp, Check, Minus, Pencil, Star, Trash2, X } from 'lucide-react';
import type { PriorityLevel } from '../models/Priority';
import { DynamicIcon } from '../../../components/ux/DynamicIcon';
import { useColorAlpha } from '../../../hooks/useColorAlpha';
import { DeleteTaskService } from '../services/DeleteTaskService';
import { useTaskBoardContext } from '../contexts/useTaskBoardContext';
import { useNotification } from '../../../contexts/notification/useNotification';
import type { Task } from '../models/Task';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/utils/cn';

interface TaskCardProps {
    task: Task;
}

const PRIORITY_ICONS: Record<PriorityLevel, React.ReactElement> = {
    low:    <ArrowDown size={12} />,
    medium: <Minus size={12} />,
    high:   <ArrowUp size={12} />,
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const color = task.category?.group?.color ?? '#9580b5';
    const tint = useColorAlpha(color, 0.16);
    const priorityTint = useColorAlpha(task.priority?.color ?? '#000000', 0.14);
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
        <article
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                'group flex flex-col gap-3 p-3 rounded-2xl bg-surface shadow-clay-sm cursor-grab active:cursor-grabbing transition-shadow',
                isDragging && 'opacity-50 shadow-clay',
            )}
            style={{ transform: CSS.Translate.toString(transform) }}
        >
            <div className="flex gap-3 items-start">
                <span
                    className="size-10 flex items-center justify-center rounded-xl shrink-0 [&_svg]:size-5"
                    style={{ backgroundColor: tint, color }}
                >
                    <DynamicIcon name={task.category?.icon ?? 'ClipboardList'} />
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-primary-950 leading-snug">{task.title}</h3>
                    <p className="text-xs text-primary-400 truncate">{task.category?.name}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {task.priority && (
                        <span
                            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                            style={{ backgroundColor: priorityTint, color: task.priority.color }}
                        >
                            {PRIORITY_ICONS[task.priority.id]}
                            {task.priority.name}
                        </span>
                    )}
                    {task.points > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-primary-400">
                            <Star size={12} className="fill-cream-300 text-cream-400" />
                            {task.points}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                        type="button"
                        aria-label="Editar tarea"
                        className="text-primary-400 cursor-pointer hover:text-secondary-600 transition-colors"
                        onClick={() => openEditModal(task)}
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        type="button"
                        aria-label="Eliminar tarea"
                        className="text-primary-400 cursor-pointer hover:text-accent-blossom-600 transition-colors"
                        onClick={handleDelete}
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
        </article>
    );
}
