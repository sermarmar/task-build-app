import { useEffect, useMemo, useState } from "react";
import { filterTasks, RetrieveTaskService } from "../services/RetrieveTaskService";
import type { Task, TaskFilters } from "../models/Task";
import { DEFAULT_TASK_FILTERS } from "../models/Task";
import type { ErrorMessage } from "../../../shared/Error";
import type { Status } from "../../../core/models/Status";
import { StatusService } from "../../../core/service/status/StatusService";

const STATUS_ORDER = ['PENDIENTE', 'EN PROGRESO', 'BLOQUEADA', 'EN REVISION', 'COMPLETADA'];

const normalize = (s: string) =>
    s.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const sortStatuses = (statuses: Status[]): Status[] =>
    statuses
        .filter(s => normalize(s.name ?? '') !== 'CANCELADA')
        .sort((a, b) => {
            const ai = STATUS_ORDER.indexOf(normalize(a.name ?? ''));
            const bi = STATUS_ORDER.indexOf(normalize(b.name ?? ''));
            const aOrder = ai === -1 ? STATUS_ORDER.length : ai;
            const bOrder = bi === -1 ? STATUS_ORDER.length : bi;
            return aOrder - bOrder;
        });

export const useTaskBoard = () => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [error, setError] = useState<ErrorMessage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState<TaskFilters>(DEFAULT_TASK_FILTERS);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            const [taskResult, statusResult] = await Promise.all([
                RetrieveTaskService().getAllTasks(),
                StatusService.getAllStatus(),
            ]);
            if (taskResult.error) {
                setError(taskResult.error);
            } else {
                setAllTasks(taskResult.tasks.filter(t => t.status != null));
            }
            if (statusResult.status) {
                setStatuses(sortStatuses(statusResult.status));
            }
            setIsLoading(false);
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

    return { tasks, statuses, error, isLoading, refreshTasks, editingTask, openEditModal, closeEditModal, filters, setFilters };
};