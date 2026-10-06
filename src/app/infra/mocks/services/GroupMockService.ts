import type { Group } from '@/app/features/group/models/Group';
import { mockDb } from '@/app/infra/mocks/mockDb';

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

export const GroupMockService = {

    getAllGroups: async () => {
        const db = mockDb.read();
        const groups: Group[] = [...db.groups].sort(byName).map(group => ({
            ...group,
            categories: db.categories
                .filter(c => c.group_id === group.id)
                .map(c => ({ id: c.id, name: c.name, icon: c.icon })),
        }));
        return { groups, error: null };
    },

    updateGroupColor: async (id: string, color: string) => {
        const db = mockDb.read();
        const group = db.groups.find(g => g.id === id);
        if (!group) return { error: { message: 'No se pudo actualizar el color del grupo.' } };

        group.color = color;
        mockDb.write(db);
        return { error: null };
    },

    // Sin caché: los mocks leen siempre de mockDb
    clearCache: () => {},

    getGroupsForSelect: async () => {
        const groups = [...mockDb.read().groups].sort(byName).map(({ id, name, color }) => ({ id, name, color }));
        return { groups, error: null };
    },

};
