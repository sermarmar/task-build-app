import { HabitLogRepository } from "../../../infra/repositories/HabitLogRepository";
import { TaskRepository } from "../../../infra/repositories/TaskRepository";
import type { Group } from "../../group/models/Group";

export const MetalHealthService = {

    getMentalHealthData: async (groups: Group[]): Promise<{
        groupPoints: { [groupName: string]: number },
        balance: number,
        error: { message: string } | null
    }> => {
        const [{ data: tasks, error: taskError }, { habitLogs, error: habitLogError }] = await Promise.all([
            TaskRepository.getCompletedInCurrentMonth(),
            HabitLogRepository.getHabitsCompleted(),
        ]);

        if (taskError || habitLogError) {
            return { groupPoints: {}, balance: 0, error: { message: 'No se pudieron obtener los datos de salud mental' } };
        }

        // Mapa categoría → nombre de grupo
        const categoryToGroup: Record<string, string> = {};
        groups.forEach(group => {
            group.categories?.forEach(cat => {
                categoryToGroup[cat.name] = group.name;
            });
        });

        // Acumular puntos por categoría
        const rawByCategory: Record<string, number> = {};
        tasks?.forEach(task => {
            const cat = task.categories?.name;
            if (!cat) return;
            rawByCategory[cat] = (rawByCategory[cat] ?? 0) + task.points;
        });
        habitLogs?.forEach(log => {
            const cat = log.habits?.categories?.name;
            if (!cat) return;
            rawByCategory[cat] = (rawByCategory[cat] ?? 0) + log.habits.points;
        });

        // Agregar por grupo
        const rawByGroup: Record<string, number> = {};
        Object.entries(rawByCategory).forEach(([cat, pts]) => {
            const groupName = categoryToGroup[cat];
            if (!groupName) return;
            rawByGroup[groupName] = (rawByGroup[groupName] ?? 0) + pts;
        });

        const total = Object.values(rawByGroup).reduce((sum, v) => sum + v, 0);

        // Todos los grupos aparecen aunque tengan 0 puntos
        const groupPoints: Record<string, number> = {};
        groups.forEach(g => { groupPoints[g.name] = rawByGroup[g.name] ?? 0; });

        if (total === 0) return { groupPoints, balance: 0, error: null };

        // Cuota ideal por grupo — cap para que ningún grupo domine
        const idealShare = total / groups.length;
        let earnedTotal = 0;
        const cappedByGroup: Record<string, number> = {};
        groups.forEach(g => {
            const capped = Math.min(rawByGroup[g.name] ?? 0, idealShare);
            cappedByGroup[g.name] = capped;
            earnedTotal += capped;
        });

        const balance = Math.round((earnedTotal / total) * 100);

        return { groupPoints: cappedByGroup, balance, error: null };
    }

};