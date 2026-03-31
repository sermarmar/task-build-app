import { createContext } from "react";
import type { Task } from "../models/Task";

interface TaskBoardContextType {
    tasks: Task[];
    error: string;
    refreshTasks: (cleanStorage?: boolean) => void;
}

export const TaskBoardContext = createContext<TaskBoardContextType | null>(null);



