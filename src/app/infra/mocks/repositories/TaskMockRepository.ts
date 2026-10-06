import type { TaskResponse } from '@/app/features/tasks/resource/TaskResponse';
import type { TaskEntity } from '@/app/infra/entities/TaskEntity';
import { findCategoryWithGroup, mockDb, mockId, type MockDb, type TaskRow } from '@/app/infra/mocks/mockDb';

const COMPLETED_STATUS_ID = 5;

const toEntity = (db: MockDb, task: TaskRow): TaskEntity => ({
    ...task,
    categories: findCategoryWithGroup(db, task.category_id),
    statuses: db.statuses.find(s => s.id === task.status_id),
});

const isCurrentMonth = (isoDate: string | null | undefined) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
};

const updateTask = (taskId: string, changes: Partial<TaskRow>) => {
    const db = mockDb.read();
    const task = db.tasks.find(t => t.id === taskId);
    if (!task) return { data: null, error: { message: 'No se pudo actualizar la tarea' } };

    Object.assign(task, changes, { updated_at: new Date().toISOString() });
    mockDb.write(db);
    return { data: toEntity(db, task), error: null };
};

export const TaskMockRepository = {

    getAll: async () => {
        const db = mockDb.read();
        return { data: db.tasks.map(t => toEntity(db, t)), error: null };
    },

    getByStatuses: async (statusIds: number[]) => {
        const db = mockDb.read();
        const tasks = db.tasks.filter(t => statusIds.includes(t.status_id));
        return { data: tasks.map(t => toEntity(db, t)), error: null };
    },

    getCompletedInCurrentMonth: async () => {
        const db = mockDb.read();
        const tasks = db.tasks.filter(t => t.status_id === COMPLETED_STATUS_ID && isCurrentMonth(t.completed_at));
        return { data: tasks.map(t => toEntity(db, t)), error: null };
    },

    create: async (task: TaskResponse) => {
        const db = mockDb.read();
        const now = new Date().toISOString();
        const row: TaskRow = { ...task, id: mockId(), created_at: now, updated_at: now, completed_at: null };

        db.tasks.push(row);
        mockDb.write(db);
        return { data: toEntity(db, row), error: null };
    },

    updateByStatus: async (taskId: string, statusId: number) =>
        updateTask(taskId, {
            status_id: statusId,
            completed_at: statusId === COMPLETED_STATUS_ID ? new Date().toISOString() : null,
        }),

    update: async (taskId: string, task: TaskResponse) => updateTask(taskId, task),

    delete: async (taskId: string) => {
        const db = mockDb.read();
        db.tasks = db.tasks.filter(t => t.id !== taskId);
        mockDb.write(db);
        return { error: null };
    },

};
