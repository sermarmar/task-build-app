import { HabitRepository } from "../../../infra/repositories/HabitRepository";
import type { ErrorMessage } from "../../../shared/Error";
import type { Habit } from "../models/Habit";
import type { HabitRequest } from "../resources/HabitRequest";
import { HabitFactory } from "./factory/HabitFactory";

export const CreateHabitService = {

    create: async (habit: HabitRequest): Promise<{habitCreated: Habit | null, error: ErrorMessage | null}> => {
        const { habitCreated, error } = await HabitRepository.create(HabitFactory.mapFromRequest(habit));

        if (error) {
            return { habitCreated: null, error };
        }

        return { habitCreated, error: null };
        
    }

};