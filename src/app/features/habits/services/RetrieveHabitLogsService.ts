import { HabitLogRepository } from "../../../infra/repositories/HabitLogRepository";
import type { ErrorMessage } from "../../../shared/Error";
import type { HabitLog } from "../models/HabitLog";

export const RetrieveHabitLogsService = {

    getHabitLogs: async (date: string): Promise<{habitLogs: HabitLog[] | null, error: ErrorMessage | null}> => {
        const { habitLogs, error } = await HabitLogRepository.getByDate(date);

        return {
            habitLogs: habitLogs || null,
            error: error || null
        }
    },
};