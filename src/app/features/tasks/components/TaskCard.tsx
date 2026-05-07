import { Pencil, Trash2 } from 'lucide-react';
import { DynamicIcon } from '../../../components/ux/DynamicIcon';
import { BadgeStatusDynamic } from '../../../components/template/status/BadgeStatusDynamic';
import { useColorAlpha } from '../../../hooks/useColorAlpha';
import { DeleteTaskService } from '../services/DeleteTaskService';
import { useTaskBoardContext } from '../contexts/useTaskBoardContext';
import type { Task } from '../models/Task';

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const color = task.category?.group?.color ?? '#6b7280';
    const bg = useColorAlpha(color, 0.2);
    const { refreshTasks, openEditModal } = useTaskBoardContext();

    const handleDelete = async () => {
        const { error } = await DeleteTaskService.delete(task.id!);
        if (!error) refreshTasks();
    };

    return (
        <div
            className="flex gap-4 items-center justify-between p-2 rounded-md border-l-5 w-full"
            style={{ backgroundColor: bg, borderColor: color }}
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
                <BadgeStatusDynamic taskId={task.id!} status={task.status} />
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
