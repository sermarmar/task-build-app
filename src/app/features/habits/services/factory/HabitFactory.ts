import type { Habit } from "../../models/Habit";
import type { HabitRequest } from "../../resources/HabitRequest";
import type { HabitEntity } from "../../../../infra/entities/HabitEntity";

export const HabitFactory = {

    mapFromRequest: (request: HabitRequest): Omit<Habit, 'id' | 'current_streak' | 'categories'> => {
        return {
            user_id: JSON.parse(sessionStorage.getItem('user') || '{}').id || '',
            title: request.title,
            description: null,
            category_id: request.category_id,
            points: request.points,
            frequency: request.frecuency as Habit['frequency'],
            custom_days: request.options_monthly?.length
                ? request.options_monthly
                : (request.options_weekly ?? null),
            is_active: true,
        };
    },

    mapFromEntity: (entity: HabitEntity): Habit => {
        return {
            id: entity.id,
            user_id: entity.user_id,
            title: entity.title,
            description: entity.description,
            category_id: entity.category_id,
            points: entity.points,
            frequency: entity.frequency,
            custom_days: entity.custom_days,
            current_streak: entity.current_streak,
            is_active: entity.is_active,
            categories: entity.categories
                ? {
                    id: entity.categories.id,
                    name: entity.categories.name,
                    icon: entity.categories.icon,
                    group: entity.categories.group ?? null,
                }
                : null,
        };
    },

}
