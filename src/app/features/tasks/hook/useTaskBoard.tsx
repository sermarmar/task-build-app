import { useEffect, useState } from "react";
import { RetrieveTaskService } from "../services/RetrieveTaskService";
import type { Task } from "../models/Task";

export const useTaskBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    }, [refreshTrigger]);

    const refreshTasks = () => setRefreshTrigger(prev => prev + 1);

    return { tasks, error, refreshTasks };
};