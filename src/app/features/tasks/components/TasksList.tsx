import { useTaskBoardContext } from '../contexts/useTaskBoardContext';
import { TaskCard } from './TaskCard';

export const TasksList: React.FC = () => {

    const { tasks, error } = useTaskBoardContext();

    return (
        <>
            {error && <div className="error">{error}</div>}
            {
                tasks.length === 0 && !error && 
                <div className='text-gray-400 font-bold text-5xl text-center'>No hay tareas disponibles</div>
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tasks
                .sort((task) => task.status?.id === 1 ? -1 : 1) // Ordena las tareas abiertas antes que las cerradas
                .map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </>
    );

}