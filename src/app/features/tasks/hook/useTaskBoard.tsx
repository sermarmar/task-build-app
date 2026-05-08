import { useEffect, useMemo, useState } from "react";
import { filterTasks, RetrieveTaskService } from "../services/RetrieveTaskService";
import type { Task, TaskFilters } from "../models/Task";
import { DEFAULT_TASK_FILTERS } from "../models/Task";
import type { ErrorMessage } from "../../../shared/Error";

export const useTaskBoard = () => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [error, setError] = useState<ErrorMessage | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState<TaskFilters>(DEFAULT_TASK_FILTERS);

    useEffect(() => {
        const fetchTasks = async () => {
            const result = await RetrieveTaskService().getTasks(false);
            if (result.error) {
                setError(result.error);
            } else {
                setAllTasks(result.tasks);
            }
        };

        fetchTasks();
    }, [refreshTrigger]);

    const tasks = useMemo(() => filterTasks(allTasks, filters), [allTasks, filters]);

    const refreshTasks = (cleanStorage?: boolean) => {
        if (cleanStorage) {
            RetrieveTaskService().removeTasksFromStorage();
        }
        setRefreshTrigger(prev => prev + 1);
    };

    const openEditModal = (task: Task) => setEditingTask(task);
    const closeEditModal = () => setEditingTask(null);

    return { tasks, error, refreshTasks, editingTask, openEditModal, closeEditModal, filters, setFilters };
};