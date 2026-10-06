import type { Category } from '@/app/core/models/Category';
import type { CategoryRequest } from '@/app/features/category/resources/CategoryRequest';
import { mockDb, mockId, type CategoryRow, type MockDb } from '@/app/infra/mocks/mockDb';

const toCategory = (db: MockDb, category: CategoryRow): Category => {
    const group = db.groups.find(g => g.id === category.group_id);
    return { ...category, group: group ? { name: group.name, color: group.color } : undefined };
};

export const CategoryMockService = {

    getAllCategories: async () => {
        const db = mockDb.read();
        return { categories: db.categories.map(c => toCategory(db, c)), error: null };
    },

    updateCategory: async (id: string, request: CategoryRequest) => {
        const db = mockDb.read();
        const category = db.categories.find(c => c.id === id);
        if (!category) return { error: { message: 'No se pudo actualizar la categoría.' } };

        Object.assign(category, {
            name: request.name,
            description: request.description,
            icon: request.icon,
            group_id: request.group_id || null,
        });
        mockDb.write(db);
        return { error: null };
    },

    deleteCategory: async (id: string) => {
        const db = mockDb.read();
        // Como la FK real: no se puede borrar una categoría que usan tareas o hábitos
        const inUse = db.tasks.some(t => t.category_id === id) || db.habits.some(h => h.category_id === id);
        if (inUse) return { error: { message: 'No se pudo eliminar la categoría.' } };

        db.categories = db.categories.filter(c => c.id !== id);
        mockDb.write(db);
        return { error: null };
    },

    createCategory: async (request: CategoryRequest) => {
        const db = mockDb.read();
        db.categories.push({
            id: mockId(),
            name: request.name,
            description: request.description,
            icon: request.icon,
            group_id: request.group_id || null,
            created_at: new Date().toISOString(),
        });
        mockDb.write(db);
        return { error: null };
    },

    // Sin caché: los mocks leen siempre de mockDb
    clearCache: () => {},

    getFirstCategory: async () => {
        const db = mockDb.read();
        const first = db.categories[0];
        return { category: first ? toCategory(db, first) : null, error: null };
    },

};
