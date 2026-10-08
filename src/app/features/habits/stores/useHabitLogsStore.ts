import { create } from 'zustand';

// Avisa a todos los HabitBoardProvider montados de que los logs han cambiado,
// para que el calendario y "Hábitos de hoy" no se queden desincronizados
interface HabitLogsState {
    version: number;
    notifyChange: () => void;
}

export const useHabitLogsStore = create<HabitLogsState>()((set) => ({
    version: 0,
    notifyChange: () => set((state) => ({ version: state.version + 1 })),
}));
