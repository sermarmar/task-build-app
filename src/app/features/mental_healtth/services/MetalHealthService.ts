import { HabitLogRepository } from "../../../infra/repositories/HabitLogRepository";
import { TaskRepository } from "../../../infra/repositories/TaskRepository";

export const MetalHealthService = {

    getMentalHealthData: async (): Promise<{ points: { [key: string]: number } | null, error: { message: string } | null }> => {
        const { tasks, error: taskError } = await TaskRepository.getTasksCompleted();
        const { habitLogs, error: habitLogError } = await HabitLogRepository.getHabitsCompleted();

        if (taskError || habitLogError) {
            console.error('Error fetching completed tasks or habit logs:', taskError || habitLogError);
            return { points: null, error: { message: 'No se pudieron obtener los datos de salud mental' } };
        }

        // Acumular puntos brutos por categoría
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

        // Convertir a porcentajes (0–100)
        const total = Object.values(rawPoints).reduce((sum, val) => sum + val, 0);

        if (total === 0) return { points: null, error: null };

        const pointsByCategory: { [key: string]: number } = {};
        for (const [category, value] of Object.entries(rawPoints)) {
            pointsByCategory[category] = Math.round((value / total) * 100);
        }

        return { points: pointsByCategory, error: null };
    }

};