import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { alarmService } from '../services/AlarmService';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export const MODE_SECONDS: Record<PomodoroMode, number> = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const LONG_BREAK_EVERY = 4; // cada 4 pomodoros de trabajo → descanso largo
const STORAGE_KEY = 'pomodoro-storage';

interface PomodoroState {
    mode: PomodoroMode;
    isActive: boolean;
    // Instante (ms) en que termina la sesión en marcha. El tiempo se calcula siempre desde aquí,
    // así sobrevive a recargas, cambios de página y al frenado de timers en pestañas en segundo plano
    endsAt: number | null;
    // Segundos restantes: en pausa es el valor real; en marcha es solo lo que se pinta
    remaining: number;
    completedWork: number;
    completedShortBreaks: number;
    completedLongBreaks: number;
    start: () => void;
    pause: () => void;
    toggle: () => void;
    changeMode: (mode: PomodoroMode) => void;
    resetTimer: () => void;
    resetCycle: () => void;
    tick: () => void;
}

const secondsLeft = (endsAt: number) => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

export const usePomodoroStore = create<PomodoroState>()(
    persist(
        (set, get) => ({
            mode: 'work',
            isActive: false,
            endsAt: null,
            remaining: MODE_SECONDS.work,
            completedWork: 0,
            completedShortBreaks: 0,
            completedLongBreaks: 0,

            start: () => {
                const { isActive, remaining, mode } = get();
                if (isActive) return;
                const seconds = remaining > 0 ? remaining : MODE_SECONDS[mode];
                set({ isActive: true, remaining: seconds, endsAt: Date.now() + seconds * 1000 });
            },

            pause: () => {
                const { isActive, endsAt } = get();
                if (!isActive || !endsAt) return;
                set({ isActive: false, endsAt: null, remaining: secondsLeft(endsAt) });
            },

            toggle: () => (get().isActive ? get().pause() : get().start()),

            changeMode: (mode) => set({ mode, isActive: false, endsAt: null, remaining: MODE_SECONDS[mode] }),

            resetTimer: () => set((state) => ({ isActive: false, endsAt: null, remaining: MODE_SECONDS[state.mode] })),

            resetCycle: () => set({
                mode: 'work',
                isActive: false,
                endsAt: null,
                remaining: MODE_SECONDS.work,
                completedWork: 0,
                completedShortBreaks: 0,
                completedLongBreaks: 0,
            }),

            tick: () => {
                const { isActive, endsAt, remaining, mode, completedWork, completedShortBreaks, completedLongBreaks } = get();
                if (!isActive) return;

                if (!endsAt) {
                    set({ endsAt: Date.now() + remaining * 1000 });
                    return;
                }

                const left = secondsLeft(endsAt);
                if (left > 0) {
                    if (left !== remaining) set({ remaining: left });
                    return;
                }

                // ── Sesión completada (también si terminó con la app cerrada) ──
                let nextMode: PomodoroMode;
                let newWork = completedWork;
                let newShort = completedShortBreaks;
                let newLong = completedLongBreaks;

                if (mode === 'work') {
                    newWork = completedWork + 1;
                    nextMode = newWork % LONG_BREAK_EVERY === 0 ? 'longBreak' : 'shortBreak';
                } else if (mode === 'shortBreak') {
                    newShort = completedShortBreaks + 1;
                    nextMode = 'work';
                } else {
                    newLong = completedLongBreaks + 1;
                    nextMode = 'work';
                }

                set({
                    isActive: false,
                    endsAt: null,
                    mode: nextMode,
                    remaining: MODE_SECONDS[nextMode],
                    completedWork: newWork,
                    completedShortBreaks: newShort,
                    completedLongBreaks: newLong,
                });

                alarmService.play().catch((err) => console.error('[Alarm] Error:', err));

                if (Notification.permission === 'granted') {
                    new Notification('⏰ Pomodoro', {
                        body: mode === 'work'
                            ? '¡Tiempo de descanso!'
                            : '¡Vamos a trabajar!',
                        icon: '/favicon.ico',
                    });
                }
            },
        }),
        {
            name: STORAGE_KEY,
            version: 1,
            partialize: (state) => ({
                mode: state.mode,
                isActive: state.isActive,
                endsAt: state.endsAt,
                remaining: state.remaining,
                completedWork: state.completedWork,
                completedShortBreaks: state.completedShortBreaks,
                completedLongBreaks: state.completedLongBreaks,
            }),
            // v0 guardaba minutes/seconds/startedAt: se convierte sin perder un pomodoro en marcha
            migrate: (persisted, version) => {
                if (version > 0) return persisted as PomodoroState;
                const old = persisted as { minutes?: number; seconds?: number; isActive?: boolean; mode?: PomodoroMode; completedWork?: number; completedShortBreaks?: number; completedLongBreaks?: number };
                const remaining = (old.minutes ?? 25) * 60 + (old.seconds ?? 0);
                return {
                    mode: old.mode ?? 'work',
                    isActive: !!old.isActive,
                    endsAt: old.isActive ? Date.now() + remaining * 1000 : null,
                    remaining,
                    completedWork: old.completedWork ?? 0,
                    completedShortBreaks: old.completedShortBreaks ?? 0,
                    completedLongBreaks: old.completedLongBreaks ?? 0,
                } as PomodoroState;
            },
        }
    )
);

// ─── Reloj global (vive fuera de React: sigue aunque se cambie de página) ─────

let intervalId: number | null = null;

const tick = () => usePomodoroStore.getState().tick();

// Con la pestaña en segundo plano el navegador frena el intervalo: al volver se recalcula al momento
const handleVisibility = () => {
    if (document.visibilityState === 'visible') tick();
};

// Con varias pestañas abiertas, lo que se haga en una (play, pausa, cambio de modo) llega a las demás
const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) usePomodoroStore.persist.rehydrate();
};

export const startPomodoroInterval = () => {
    if (intervalId) return;
    intervalId = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('storage', handleStorage);
    tick();
};

export const stopPomodoroInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('storage', handleStorage);
};
