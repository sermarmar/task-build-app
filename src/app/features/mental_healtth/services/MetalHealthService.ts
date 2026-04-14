import { TaskRepository } from "../../../infra/repositories/TaskRepository";

export const MetalHealthService = {

    getMentalHealthData: async (): Promise<{ points: { [key: string]: number } | null, error: { message: string } | null }> => {
        const { tasks, error } = await TaskRepository.getTasksCompleted();
        if (error) {
            console.error('Error fetching completed tasks:', error);
            return { points: null, error: { message: 'No se pudieron obtener los datos de salud mental' } };
        }

        // Calculate points for each category
        const pointsByCategory: { [key: string]: number } = {};
        tasks?.forEach(task => {
            const categoryName = task.categories.name;
            pointsByCategory[categoryName] = (pointsByCategory[categoryName] || 0) + task.points;
        });

        return { points: pointsByCategory, error: null };
    }

};