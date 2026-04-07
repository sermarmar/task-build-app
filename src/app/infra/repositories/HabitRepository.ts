import { supabase } from "../../../config/Database";
import type { Habit } from "../../features/habits/models/Habit";

export const HabitRepository = {

    create: async (habit: Habit): Promise<{habitCreated: Habit | null, error: any}> => {
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