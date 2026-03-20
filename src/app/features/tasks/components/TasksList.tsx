import { useEffect, useState } from 'react';
import type { Task } from '../models/Task';
import { RetrieveTaskService } from '../services/RetrieveTaskService';
import { TaskCard } from './TaskCard';

export const TasksList: React.FC = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            const result = await RetrieveTaskService().getTasks(false);
            if (result.error) {
                setError(result.error);
            } else {
                setTasks(result.tasks);
            }
        };

        fetchTasks();
    }, []);

    return (
        <>
            {error && <div className="error">{error}</div>}
            {
                tasks.length === 0 && !error && 
                <div className='text-gray-400 font-bold text-5xl text-center'>No hay tareas disponibles</div>
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tasks
                .sort((task) => task.status?.id === 1 ? -1 : 1) // Ordena las tareas abiertas antes que las cerradas
                .map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </>
    );

}