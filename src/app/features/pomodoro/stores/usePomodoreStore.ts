import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { alarmService } from '../services/AlarmService';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const MINUTES: Record<Mode, number> = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
};

const LONG_BREAK_EVERY = 4; // cada 4 pomodoros de trabajo → descanso largo

interface PomodoroState {
    minutes: number;
    seconds: number;
    isActive: boolean;
    mode: Mode;
    // Contadores por tipo
    completedWork: number;
    completedShortBreaks: number;
    completedLongBreaks: number;
    startedAt: number | null;
    // Acciones
    setMinutes: (m: number) => void;
    setSeconds: (s: number) => void;
    setIsActive: (v: boolean | ((prev: boolean) => boolean)) => void;
    setMode: (m: Mode) => void;
    setStartedAt: (t: number | null) => void;
    reset: (mode: Mode) => void;
    tick: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
    persist(
        (set, get) => ({
            minutes: 25,
            seconds: 0,
            isActive: false,
            mode: 'work',
            completedWork: 0,
            completedShortBreaks: 0,
            completedLongBreaks: 0,
            startedAt: null,

            setMinutes: (m) => set({ minutes: m }),
            setSeconds: (s) => set({ seconds: s }),
            setIsActive: (v) => set((state) => ({
                isActive: typeof v === 'function' ? v(state.isActive) : v,
            })),
            setMode: (m) => set({ mode: m }),
            setStartedAt: (t) => set({ startedAt: t }),
            reset: (mode) => set({
                minutes: MINUTES[mode],
                seconds: 0,
                isActive: false,
                startedAt: null,
            }),

            tick: () => {
                const {
                    isActive, minutes, seconds, mode,
                    completedWork, completedShortBreaks, completedLongBreaks,
                } = get();
                if (!isActive) return;

                // Cuenta atrás normal
                if (seconds > 0) { set({ seconds: seconds - 1 }); return; }
                if (minutes > 0) { set({ minutes: minutes - 1, seconds: 59 }); return; }

                // ── Timer completado ──────────────────────────────────────
                let nextMode: Mode;
                let newWork = completedWork;
                let newShort = completedShortBreaks;
                let newLong = completedLongBreaks;

                if (mode === 'work') {
                    newWork = completedWork + 1;
                    // Cada LONG_BREAK_EVERY trabajos → descanso largo
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
                    startedAt: null,
                    mode: nextMode,
                    minutes: MINUTES[nextMode],
                    seconds: 0,
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
            name: 'pomodoro-storage',
            partialize: (state) => ({
                minutes: state.minutes,
                seconds: state.seconds,
                mode: state.mode,
                completedWork: state.completedWork,
                completedShortBreaks: state.completedShortBreaks,
                completedLongBreaks: state.completedLongBreaks,
                isActive: state.isActive,
                startedAt: state.startedAt,
            }),
        }
    )
);

// ─── Intervalo global ─────────────────────────────────────────────────────────

let intervalId: number | null = null;

export const startPomodoroInterval = () => {
    if (intervalId) return;
    intervalId = window.setInterval(() => {
        usePomodoroStore.getState().tick();
    }, 1000);
};

export const stopPomodoroInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};