import { HabitRepository } from "../../../infra/repositories/HabitRepository";
import type { ErrorMessage } from "../../../shared/Error";

export const DeleteHabitService = {

    delete: async (id: string): Promise<{ error: ErrorMessage | null }> => {
        const { error } = await HabitRepository.delete(id);

        if (error) {
            return { error };
        }

        return { error: null };
    },

};
