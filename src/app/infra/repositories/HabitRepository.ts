import { supabase } from "../../../config/Database";
import type { Habit } from "../../features/habits/models/Habit";
import type { HabitRequest } from "../../features/habits/resources/HabitRequest";

export const HabitRepository = {

    create: async (habit: HabitRequest): Promise<{habitCreated: Habit | null, error: any}> => {
        const {data, error} = await supabase
            .from('habits')
            .insert([habit])
            .select('*, categories:category_id (*)')
            .single();

        if (error) {
            return { habitCreated: null, error };
        }

        return { habitCreated: data, error: null };
    }

}