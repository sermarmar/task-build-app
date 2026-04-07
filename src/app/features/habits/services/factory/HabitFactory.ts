import type { Habit } from "../../models/Habit";
import type { HabitRequest } from "../../resources/HabitRequest";


export const HabitFactory = {

    mapFromRequest: (request: HabitRequest): Habit => {
        return {
            user_id: JSON.parse(sessionStorage.getItem('user') || '{}').id || '',
            title: request.title || '',
            description: '',
            category_id: request.category_id,
            points: request.points || 0,
            frequency: request.frecuency || '',
            custom_days: request.options_monthly?.length ? request.options_monthly : request.options_weekly || [],
            current_streak: 0,
            is_active: true,
            created_at: new Date(),
        };
    }

} 