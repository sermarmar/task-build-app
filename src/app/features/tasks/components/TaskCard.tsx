import { ArrowDown, ArrowUp, Check, Minus, Pencil, Star, Trash2, X } from 'lucide-react';
import type { PriorityLevel } from '../models/Priority';
import { DynamicIcon } from '../../../components/ux/DynamicIcon';
import { useColorAlpha } from '../../../hooks/useColorAlpha';
import { DeleteTaskService } from '../services/DeleteTaskService';
import { useTaskBoardContext } from '../contexts/useTaskBoardContext';
import { useNotification } from '../../../contexts/notification/useNotification';
import type { Task } from '../models/Task';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/utils/cn';

interface TaskCardProps {
    task: Task;
}

interface TaskCardViewProps {
    task: Task;
    className?: string;
    actions?: React.ReactNode;
}

const PRIORITY_ICONS: Record<PriorityLevel, React.ReactElement> = {
    low:    <ArrowDown size={12} />,
    medium: <Minus size={12} />,
    high:   <ArrowUp size={12} />,
};

// Solo presentación: lo usan la tarjeta arrastrable y la copia que flota en el DragOverlay
export const TaskCardView: React.FC<TaskCardViewProps> = ({ task, className, actions }) => {
    const color = task.category?.group?.color ?? '#9580b5';
    const priorityTint = useColorAlpha(task.priority?.color ?? '#000000', 0.14);

    return (
        <article className={cn('group flex flex-col gap-3 p-3 rounded-2xl bg-surface shadow-clay-sm', className)}>
            <div className="flex gap-3 items-start">
                <span
                    className="size-10 flex items-center justify-center rounded-2xl shrink-0 text-white shadow-clay-pressed [&_svg]:size-5"
                    style={{ background: `linear-gradient(160deg, ${color}aa, ${color})` }}
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
                {actions}
            </div>
        </article>
    );
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { refreshTasks, openEditModal } = useTaskBoardContext();
    const { notify } = useNotification();

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id! });

    const handleDelete = async () => {
        const { error } = await DeleteTaskService.delete(task.id!);
        if (error) {
            notify(<><X /><span>No se pudo eliminar la tarea.</span></>, 'danger');
        } else {
            refreshTasks();
            notify(<><Check /><span>Tarea eliminada correctamente.</span></>, 'success');
        }
    };

    const actions = (
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
    );

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            <TaskCardView
                task={task}
                actions={actions}
                className={cn(isDragging && 'opacity-40 shadow-none border-2 border-dashed border-tertiary-300')}
            />
        </div>
    );
}
