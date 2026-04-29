import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { alarmService } from '../services/AlarmService';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const MINUTES: Record<Mode, number> = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
};

interface PomodoroState {
    minutes: number;
    seconds: number;
    isActive: boolean;
    mode: Mode;
    completedCycles: number;
    startedAt: number | null;
    // Acciones
    setMinutes: (m: number) => void;
    setSeconds: (s: number) => void;
    setIsActive: (v: boolean | ((prev: boolean) => boolean)) => void;
    setMode: (m: Mode) => void;
    setCompletedCycles: (fn: (prev: number) => number) => void;
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
            completedCycles: 0,
            startedAt: null,

            setMinutes: (m) => set({ minutes: m }),
            setSeconds: (s) => set({ seconds: s }),
            setIsActive: (v) => set((state) => ({
                isActive: typeof v === 'function' ? v(state.isActive) : v
            })),
            setMode: (m) => set({ mode: m }),
            setCompletedCycles: (fn) => set((state) => ({
                completedCycles: fn(state.completedCycles)
            })),
            setStartedAt: (t) => set({ startedAt: t }),
            reset: (mode) => set({
                minutes: MINUTES[mode],
                seconds: 0,
                isActive: false,
                startedAt: null,
            }),

            tick: () => {
                const { isActive, minutes, seconds, mode, completedCycles } = get();
                if (!isActive) return;

                // Cuenta atrás normal
                if (seconds > 0) {
                    set({ seconds: seconds - 1 });
                    return;
                }

                if (minutes > 0) {
                    set({ minutes: minutes - 1, seconds: 59 });
                    return;
                }

                // Timer completado — calcular siguiente modo
                let nextMode: Mode = 'work';
                let nextCycles = completedCycles;

                if (mode === 'work') {
                    nextMode = 'shortBreak';
                    nextCycles = completedCycles < 8 ? completedCycles + 1 : completedCycles;
                } else {
                    nextMode = 'work';
                }

                set({
                    isActive: false,
                    startedAt: null,
                    mode: nextMode,
                    minutes: MINUTES[nextMode],
                    seconds: 0,
                    completedCycles: nextCycles,
                });

                // Reproducir alarma via singleton
                alarmService.play().catch((err) => console.error('[Alarm] Error:', err));
                
                // Notificación del navegador
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
                completedCycles: state.completedCycles,
                isActive: state.isActive,
                startedAt: state.startedAt,
            }),
        }
    )
);

// ─── Intervalo global — vive fuera del componente ────────────────────────────

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