import { HabitLogRepository } from "../../../infra/repositories/HabitLogRepository";
import type { ErrorMessage } from "../../../shared/Error";
import type { HabitLog } from "../models/HabitLog";

const LOGS_CACHE_PREFIX = 'habit_logs_';

export const RetrieveHabitLogsService = {

    getHabitLogs: async (date: string): Promise<{habitLogs: HabitLog[] | null, error: ErrorMessage | null}> => {
        const cacheKey = `${LOGS_CACHE_PREFIX}${date}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            return { habitLogs: JSON.parse(cached), error: null };
        }

        const { habitLogs, error } = await HabitLogRepository.getByDate(date);

        if (error) {
            return { habitLogs: null, error };
        }

        sessionStorage.setItem(cacheKey, JSON.stringify(habitLogs));
        return { habitLogs, error: null };
    },

    removeLogsFromStorage: (date?: string) => {
        if (date) {
            sessionStorage.removeItem(`${LOGS_CACHE_PREFIX}${date}`);
        } else {
            Object.keys(sessionStorage)
                .filter(key => key.startsWith(LOGS_CACHE_PREFIX))
                .forEach(key => sessionStorage.removeItem(key));
        }
    }

};
