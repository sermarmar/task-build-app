import { Bed, GlassWater, Laptop, Pause, Play, RefreshCcw, RotateCcw, Timer } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { usePomodoroStore } from "../stores/usePomodoreStore";
import { Card } from "@/app/components/ux/Card";
import { CircularProgress } from "@/app/components/ux/CircularProgress";
import { Button } from "@/app/components/ux/Button";
import { cn } from "@/utils/cn";

const MODES = {
    WORK: {
        name: 'work' as const,
        label: 'Trabajo',
        minutes: 25,
        strokeColor: "var(--color-tertiary-400)",
        activeClass: "clay-peach text-white",
        dotClass: "clay-peach",
    },
    SHORT_BREAK: {
        name: 'shortBreak' as const,
        label: 'Descanso',
        minutes: 5,
        strokeColor: "var(--color-secondary-400)",
        activeClass: "clay-blue text-secondary-950",
        dotClass: "clay-blue",
    },
    LONG_BREAK: {
        name: 'longBreak' as const,
        label: 'Descanso largo',
        minutes: 15,
        strokeColor: "var(--color-lilac-400)",
        activeClass: "bg-lilac-300 text-primary-950",
        dotClass: "bg-lilac-400",
    }
};

const MODE_ICONS = {
    work: <Laptop />,
    shortBreak: <GlassWater />,
    longBreak: <Bed />,
};

const CYCLE_SLOTS = 8;

type ModeType = typeof MODES.WORK.name | typeof MODES.SHORT_BREAK.name | typeof MODES.LONG_BREAK.name;

export const Pomodoro: React.FC = () => {
    const {
        minutes, seconds, isActive, mode,
        completedWork, completedShortBreaks, completedLongBreaks,
        startedAt,
        setMinutes, setSeconds, setIsActive, setMode, setStartedAt, reset, resetCycle
    } = usePomodoroStore();

    const getTotalSeconds = useCallback((m: ModeType) => {
        switch (m) {
            case MODES.WORK.name:        return MODES.WORK.minutes * 60;
            case MODES.SHORT_BREAK.name: return MODES.SHORT_BREAK.minutes * 60;
            case MODES.LONG_BREAK.name:  return MODES.LONG_BREAK.minutes * 60;
            default: return 0;
        }
    }, []);

    const setTimerByMode = useCallback((m: ModeType) => {
        switch (m) {
            case MODES.WORK.name:        setMinutes(MODES.WORK.minutes); break;
            case MODES.SHORT_BREAK.name: setMinutes(MODES.SHORT_BREAK.minutes); break;
            case MODES.LONG_BREAK.name:  setMinutes(MODES.LONG_BREAK.minutes); break;
        }
        setSeconds(0);
    }, [setMinutes, setSeconds]);

    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (isActive && startedAt) {
            const elapsed = Math.floor((Date.now() - startedAt) / 1000);
            const totalRemaining = minutes * 60 + seconds - elapsed;

            if (totalRemaining <= 0) {
                reset(mode);
            } else {
                setMinutes(Math.floor(totalRemaining / 60));
                setSeconds(totalRemaining % 60);
                setStartedAt(Date.now());
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeMode = (newMode: ModeType) => {
        setMode(newMode);
        setTimerByMode(newMode);
        setIsActive(false);
        setStartedAt(null);
    };

    const handleReset = () => {
        reset(mode);
        setTimerByMode(mode);
    };

    const handleToggle = () => {
        if (!isActive) {
            setStartedAt(Date.now());
        } else {
            setStartedAt(null);
        }
        setIsActive((prev) => !prev);
    };

    const totalSeconds = getTotalSeconds(mode) || 1;
    const currentSeconds = minutes * 60 + seconds;
    const progress = Math.round((currentSeconds / totalSeconds) * 100);

    const currentMode = mode === MODES.WORK.name
        ? MODES.WORK
        : mode === MODES.SHORT_BREAK.name
            ? MODES.SHORT_BREAK
            : MODES.LONG_BREAK;

    const cycles = [
        { mode: MODES.WORK,        done: completedWork },
        { mode: MODES.SHORT_BREAK, done: completedShortBreaks },
        { mode: MODES.LONG_BREAK,  done: completedLongBreaks },
    ];

    const tabTitle = (
        <>
            <Timer />
            Pomodoro
        </>
    );

    const tabActions = (
        <Button type="button" color="light" form="rounded" size="sm" onClick={resetCycle} title="Reiniciar ciclo">
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Reiniciar ciclo</span>
        </Button>
    );

    return (
        <Card tabTitle={tabTitle} tabSubtitle={`Ciclos completados: ${completedWork}`} tabActions={tabActions}>
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-8 h-full">
                <div className="flex md:flex-col gap-3 justify-center" role="radiogroup" aria-label="Modo del temporizador">
                    {[MODES.WORK, MODES.SHORT_BREAK, MODES.LONG_BREAK].map((m) => {
                        const active = mode === m.name;
                        return (
                            <button
                                key={m.name}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => handleChangeMode(m.name)}
                                className={cn(
                                    "flex items-center gap-3 rounded-full p-1.5 pr-5 font-bold text-sm transition-all cursor-pointer",
                                    active ? cn(m.activeClass, "shadow-clay-pressed") : "bg-white/40 text-primary-500 shadow-clay-inset hover:text-primary-800",
                                )}
                            >
                                <span className={cn(
                                    "size-9 rounded-full flex items-center justify-center shrink-0 [&_svg]:size-4",
                                    active ? "clay-knob text-primary-800" : "text-primary-400",
                                )}>
                                    {MODE_ICONS[m.name]}
                                </span>
                                <span className="hidden sm:inline whitespace-nowrap">{m.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center gap-5">
                    <CircularProgress
                        value={progress}
                        text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                        size={200}
                        strokeWidth={12}
                        color={currentMode.strokeColor}
                        knob
                        textClassName="text-5xl tabular-nums"
                    />
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            aria-label="Reiniciar temporizador"
                            className="size-11 rounded-full clay-knob flex items-center justify-center text-primary-600 hover:text-primary-900 transition cursor-pointer"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={handleToggle}
                            aria-label={isActive ? 'Pausar' : 'Iniciar'}
                            className="size-16 rounded-full clay-peach shadow-clay-pressed flex items-center justify-center text-white transition hover:-translate-y-0.5 cursor-pointer"
                        >
                            {isActive ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
                        </button>
                    </div>
                </div>

                <div className="flex md:flex-col gap-4 justify-center">
                    {cycles.map(({ mode: m, done }) => (
                        <div key={m.name} className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-primary-500">{m.label}</span>
                            <div className="flex gap-1.5">
                                {Array.from({ length: CYCLE_SLOTS }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={cn(
                                            "block size-3.5 rounded-full transition-all duration-300",
                                            i < done ? cn(m.dotClass, "shadow-clay-sm") : "bg-primary-100 shadow-clay-inset",
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
