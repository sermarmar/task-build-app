import { createContext } from "react";
import type { Task } from "../models/Task";

interface TaskBoardContextType {
    tasks: Task[];
    error: string;
    refreshTasks: () => void;
}

export const TaskBoardContext = createContext<TaskBoardContextType | null>(null);



