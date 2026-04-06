import { HabitRepository } from "../../../infra/repositories/HabitRepository";
import type { Habit } from "../models/Habit";
import type { HabitRequest } from "../resources/HabitRequest";

export const CreateHabitService = {

    create: async (habit: HabitRequest): Promise<{habitCreated: Habit | null, error: any}> => {
        const { habitCreated, error } = await HabitRepository.create(habit);

        if (error) {
            return { habitCreated: null, error };
        }

        return { habitCreated, error: null };
        
    }

};