import { HabitLogRepository } from "../../../infra/repositories/HabitLogRepository";
import { TaskRepository } from "../../../infra/repositories/TaskRepository";

export const MetalHealthService = {

    getMentalHealthData: async (totalCategories: number): Promise<{
        points: { [key: string]: number } | null,
        balance: number,
        error: { message: string } | null
    }> => {
        const { tasks, error: taskError } = await TaskRepository.getTasksCompleted();
        const { habitLogs, error: habitLogError } = await HabitLogRepository.getHabitsCompleted();

        if (taskError || habitLogError) {
            console.error('Error fetching completed tasks or habit logs:', taskError || habitLogError);
            return { points: null, balance: 0, error: { message: 'No se pudieron obtener los datos de salud mental' } };
        }

        const rawPoints: { [key: string]: number } = {};

        tasks?.forEach(task => {
            const categoryName = task.categories?.name;
            if (!categoryName) return;
            rawPoints[categoryName] = (rawPoints[categoryName] || 0) + task.points;
        });

        habitLogs?.forEach(log => {
            const categoryName = log.habits?.categories?.name;
            if (!categoryName) return;
            rawPoints[categoryName] = (rawPoints[categoryName] || 0) + log.habits.points;
        });

        const total = Object.values(rawPoints).reduce((sum, val) => sum + val, 0);

        if (total === 0) return { points: null, balance: 0, error: null };

        // Cuota ideal sobre el total de categorías existentes, no solo las activas
        const idealShare = total / totalCategories;

        // Cada categoría se topa en su cuota justa — las dominantes no se inflan
        const cappedPoints: { [key: string]: number } = {};
        let earnedTotal = 0;
        for (const [category, value] of Object.entries(rawPoints)) {
            const capped = Math.min(value, idealShare);
            cappedPoints[category] = capped;
            earnedTotal += capped;
        }

        // Balance global: qué porcentaje del total "justo" se ha conseguido
        const balance = Math.round((earnedTotal / total) * 100);

        return { points: cappedPoints, balance, error: null };
    }

};