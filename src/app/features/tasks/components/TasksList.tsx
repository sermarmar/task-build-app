import { useTaskBoardContext } from '../contexts/useTaskBoardContext';
import { TaskCard } from './TaskCard';
import { Skeleton, SkeletonLine } from '@/app/components/ux/Skeleton';

const TaskCardSkeleton: React.FC = () => (
    <div className="rounded-xl border border-primary-100 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <SkeletonLine className="w-2/3" />
            <Skeleton className="w-6 h-6 rounded-full" />
        </div>
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-4/5" />
        <div className="flex gap-2 mt-1">
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-20 h-5 rounded-full" />
        </div>
    </div>
);

export const TasksList: React.FC = () => {

    const { tasks, error, isLoading } = useTaskBoardContext();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <TaskCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <>
            {error && <div className="error">{error.message}</div>}
            {
                tasks.length === 0 && !error &&
                <div className='text-gray-400 font-bold text-5xl text-center'>No hay tareas disponibles</div>
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tasks
                .sort((task) => task.status?.id === 1 ? -1 : 1)
                .map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </>
    );

}