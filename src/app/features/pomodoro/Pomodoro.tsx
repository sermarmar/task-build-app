import { Bed, GlassWater, Laptop, Pause, Play, RotateCcw } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { Card } from '../../components/ux/Card';
import { Button } from '../../components/ux/Button';
import { CircularProgress } from "../../components/ux/CircularProgress";
import { ButtonWithIcon } from '../../components/ux/ButtonWithIcon';
import { usePomodoroStore } from "./stores/usePomodoreStore";

const MODES = {
    WORK: {
        name: 'work' as const,
        label: 'Trabajo',
        minutes: 25,
        strokeColor: "var(--color-primary-900)"
    },
    SHORT_BREAK: {
        name: 'shortBreak' as const,
        label: 'Descanso',
        minutes: 5,
        strokeColor: "var(--color-secondary-500)"
    },
    LONG_BREAK: {
        name: 'longBreak' as const,
        label: 'Descanso largo',
        minutes: 15,
        strokeColor: "var(--color-tertiary-300)"
    }
};

const MODE_ICONS = {
    work: <Laptop />,
    shortBreak: <GlassWater />,
    longBreak: <Bed />,
};

type ModeType = typeof MODES.WORK.name | typeof MODES.SHORT_BREAK.name | typeof MODES.LONG_BREAK.name;

export const Pomodoro: React.FC = () => {
    const {
        minutes, seconds, isActive, mode, completedCycles, startedAt,
        setMinutes, setSeconds, setIsActive, setMode, setStartedAt, reset
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

    // Pedir permiso de notificaciones al montar
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Al montar, recalcula el tiempo perdido si el timer estaba activo
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
    }, []); // solo al montar

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

    return (
        <>
            <h3 className="text-lg font-medium ml-4 mb-2">Pomodoro</h3>
            <Card className="flex items-center justify-center gap-20">
                <div className="flex flex-col gap-5">
                    <ButtonWithIcon
                        onClick={() => handleChangeMode(MODES.WORK.name)}
                        bgColor={mode === MODES.WORK.name ? "bg-primary-900" : "bg-primary-700/60"}
                        buttonText={MODES.WORK.label}
                        textColor={mode === MODES.WORK.name ? "text-tertiary-50" : "text-primary-900/80"}
                        iconColor={mode === MODES.WORK.name ? "text-primary-900" : "text-secondary-500"}
                        buttonColor={mode === MODES.WORK.name ? "bg-tertiary-300" : "bg-transparent"}
                        icon={MODE_ICONS.work}
                        size="small"
                    />
                    <ButtonWithIcon
                        onClick={() => handleChangeMode(MODES.SHORT_BREAK.name)}
                        bgColor={mode === MODES.SHORT_BREAK.name ? "bg-secondary-500" : "bg-secondary-200"}
                        buttonText={MODES.SHORT_BREAK.label}
                        textColor={mode === MODES.SHORT_BREAK.name ? "text-tertiary-50" : "text-primary-900/80"}
                        iconColor={mode === MODES.SHORT_BREAK.name ? "text-tertiary-50" : "text-secondary-500"}
                        buttonColor={mode === MODES.SHORT_BREAK.name ? "bg-secondary-700" : "bg-transparent"}
                        icon={MODE_ICONS.shortBreak}
                        size="small"
                    />
                    <ButtonWithIcon
                        onClick={() => handleChangeMode(MODES.LONG_BREAK.name)}
                        bgColor={mode === MODES.LONG_BREAK.name ? "bg-tertiary-300" : "bg-tertiary-100"}
                        buttonText={MODES.LONG_BREAK.label}
                        textColor={mode === MODES.LONG_BREAK.name ? "text-primary-900" : "text-primary-900/80"}
                        iconColor={mode === MODES.LONG_BREAK.name ? "text-tertiary-50" : "text-secondary-500"}
                        buttonColor={mode === MODES.LONG_BREAK.name ? "bg-primary-900" : "bg-transparent"}
                        icon={MODE_ICONS.longBreak}
                        size="small"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <CircularProgress
                        value={progress}
                        text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                        size={150}
                        strokeWidth={5}
                        color={currentMode.strokeColor}
                    />
                    <div className="flex gap-6 justify-center mt-4">
                        <Button type="button" color="primary" form="pill" onClick={handleToggle}>
                            {isActive ? <Pause /> : <Play />}
                        </Button>
                        <Button type="button" color="secondary" form="pill" onClick={handleReset}>
                            <RotateCcw />
                        </Button>
                    </div>
                    <div className="text-sm text-primary-900/80 mt-4 text-center">
                        Ciclos completados: {completedCycles}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <span
                            key={i}
                            className={`block w-4 h-4 rounded-sm transition-all duration-300 ${
                                i < completedCycles ? "bg-primary-900" : "bg-primary-950/30"
                            }`}
                        />
                    ))}
                </div>
            </Card>
        </>
    );
};