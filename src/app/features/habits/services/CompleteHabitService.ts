import { HabitLogRepository } from "../../../infra/repositories/HabitLogRepository"

export const CompleteHabitService = {

    execute: async (habitId: string, date: string, isCompleted?: boolean): Promise<void> => {
        
        let errorMessage = null;
        const userId = JSON.parse(sessionStorage.getItem('user') || '{}').id;

        if (isCompleted) {
            const { error } = await HabitLogRepository.create(habitId, userId, date);
            errorMessage = error?.message || null;
        } else {
            const { habitLogs } = await HabitLogRepository.getByHabitIdAndDate(habitId, date);
            if (habitLogs && habitLogs.length > 0) {
                const { error } = await HabitLogRepository.delete(habitLogs[0].id);
                errorMessage = error?.message || null;
            }
        }
        
        if (errorMessage) {
            throw new Error(errorMessage);
        }

    }

}