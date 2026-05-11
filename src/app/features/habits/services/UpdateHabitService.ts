import { HabitRepository } from "../../../infra/repositories/HabitRepository";
import type { ErrorMessage } from "../../../shared/Error";
import type { Habit } from "../models/Habit";
import type { HabitRequest } from "../resources/HabitRequest";
import { HabitFactory } from "./factory/HabitFactory";

export const UpdateHabitService = {

    update: async (id: string, request: HabitRequest): Promise<{ habitUpdated: Habit | null; error: ErrorMessage | null }> => {
        const updates = HabitFactory.mapFromRequest(request);
        const { habitUpdated, error } = await HabitRepository.update(id, updates);

        if (error) {
            return { habitUpdated: null, error };
        }

        return { habitUpdated, error: null };
    },

};
