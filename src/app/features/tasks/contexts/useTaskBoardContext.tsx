import { useContext } from "react";
import { TaskBoardContext } from "./TaskBoardContext";

export const useTaskBoardContext = () => {
    const ctx = useContext(TaskBoardContext);
    if (!ctx) throw new Error('useTaskBoardContext must be used within TaskBoardProvider');
    return ctx;
};