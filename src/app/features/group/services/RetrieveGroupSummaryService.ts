import { GroupService } from "@/app/core/service/groups/GroupService";
import { HabitRepository } from "@/app/infra/repositories/HabitRepository";
import type { ErrorMessage } from "@/app/shared/Error";

export interface GroupSummary {
    id: string;
    name: string;
    color: string;
    icon: string;
    habits: number;
    categories: number;
}

export const RetrieveGroupSummaryService = {

    getSummary: async (): Promise<{ groups: GroupSummary[]; error: ErrorMessage | null }> => {
        const [{ groups, error: groupError }, { habits, error: habitError }] = await Promise.all([
            GroupService.getAllGroups(),
            HabitRepository.getHabitsByDays(),
        ]);

        if (groupError || habitError || !groups) {
            return { groups: [], error: groupError ?? habitError ?? { message: 'No se pudieron obtener tus áreas' } };
        }

        // El hábito solo trae el nombre del grupo (no su id) en la relación embebida
        const habitsByGroup = habits.reduce<Record<string, number>>((acc, habit) => {
            const groupName = habit.categories?.group?.name;
            if (groupName) acc[groupName] = (acc[groupName] ?? 0) + 1;
            return acc;
        }, {});

        return {
            groups: groups
                .map(group => ({
                    id: group.id,
                    name: group.name.charAt(0).toUpperCase() + group.name.slice(1),
                    color: group.color,
                    icon: group.categories?.[0]?.icon ?? 'Sparkles',
                    habits: habitsByGroup[group.name] ?? 0,
                    categories: group.categories?.length ?? 0,
                }))
                .sort((a, b) => b.habits - a.habits),
            error: null,
        };
    },

};
