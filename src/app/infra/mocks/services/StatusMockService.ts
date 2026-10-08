import { mockDb } from '@/app/infra/mocks/mockDb';

export const StatusMockService = {

    getAllStatus: async () => ({ status: mockDb.read().statuses, error: null }),

    getFirstStatus: async () => {
        const first = mockDb.read().statuses[0];
        return first
            ? { status: first, error: null }
            : { status: null, error: { message: 'No status found in session storage' } };
    },

};
