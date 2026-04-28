import { Bed, GlassWater, Laptop, Pause, Play, RotateCcw } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card } from '../components/ux/Card';
import { Button } from '../components/ux/Button';
import { useAlarm } from "../hooks/useAlarm";
import { CircularProgress } from "../components/ux/CircularProgress";
import { ButtonWithIcon } from '../components/ux/ButtonWithIcon';

const MODES = {
    WORK: {
        name: 'work' as const,
        label: 'Trabajo',
        minutes: 25,
        icon: <Laptop />,
        strokeColor: "var(--color-primary-900)"
    },
    SHORT_BREAK: {
        name: 'shortBreak' as const,
        label: 'Descanso',
        minutes: 5,
        icon: <GlassWater />,
        strokeColor: "var(--color-secondary-500)"
    },
    LONG_BREAK: {
        name: 'longBreak' as const,
        label: 'Descanso largo',
        minutes: 15,
        icon: <Bed />,
        strokeColor: "var(--color-tertiary-300)"
    }
};

type ModeType = typeof MODES.WORK.name | typeof MODES.SHORT_BREAK.name | typeof MODES.LONG_BREAK.name;


export const Pomodoro: React.FC = () => {
    // Estados principales
    const [minutes, setMinutes] = useState<number>(MODES.WORK.minutes);
    const [seconds, setSeconds] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [mode, setMode] = useState<ModeType>(MODES.WORK.name);
    const [completedCycles, setCompletedCycles] = useState<number>(0);
    const alarm = useAlarm();
    // Usar tipo number para setInterval en navegador
    const intervalRef = useRef<number | null>(null);

    // Calcula los segundos totales según el modo
    const getTotalSeconds = useCallback((mode: ModeType) => {
        switch (mode) {
            case MODES.WORK.name:
                return MODES.WORK.minutes * 60;
            case MODES.SHORT_BREAK.name:
                return MODES.SHORT_BREAK.minutes * 60;
            case MODES.LONG_BREAK.name:
                return MODES.LONG_BREAK.minutes * 60;
            default:
                return 0;
        }
    }, []);

    // Actualiza el temporizador según el modo
    const setTimerByMode = useCallback((mode: ModeType) => {
        switch (mode) {
            case MODES.WORK.name:
                setMinutes(MODES.WORK.minutes);
                break;
            case MODES.SHORT_BREAK.name:
                setMinutes(MODES.SHORT_BREAK.minutes);
                break;
            case MODES.LONG_BREAK.name:
                setMinutes(MODES.LONG_BREAK.minutes);
                break;
        }
        setSeconds(0);
    }, []);

    // Maneja el cambio de modo
    const handleChangeMode = (newMode: ModeType) => {
        setMode(newMode);
        setTimerByMode(newMode);
        setIsActive(false);
    };

    // Reinicia el temporizador
    const handleReset = () => {
        setIsActive(false);
        setTimerByMode(mode);
        // Detener cualquier sonido de alarma
        // (Si tienes un audio global, aquí puedes pausar)
    };

    // Alterna el estado de actividad del temporizador
    const handleToggle = () => {
        setIsActive((prev) => !prev);
    };

    // Efecto principal del temporizador
    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds === 0) {
                        setMinutes((prevMinutes) => {
                            if (prevMinutes === 0) {
                                // Timer completado
                                setIsActive(false);
                                if (mode === MODES.WORK.name) {
                                    setCompletedCycles((prev) => prev < 5 ? prev + 1 : prev);
                                    setMode(MODES.SHORT_BREAK.name);
                                    setTimerByMode(MODES.SHORT_BREAK.name);
                                } else if (mode === MODES.SHORT_BREAK.name) {
                                    setMode(MODES.WORK.name);
                                    setTimerByMode(MODES.WORK.name);
                                } else if (mode === MODES.LONG_BREAK.name) {
                                    setMode(MODES.WORK.name);
                                    setTimerByMode(MODES.WORK.name);
                                }
                                alarm.play();
                                return prevMinutes;
                            } else {
                                setSeconds(59);
                                return prevMinutes - 1;
                            }
                        });
                        return prevSeconds;
                    } else {
                        return prevSeconds - 1;
                    }
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, mode, setTimerByMode, alarm]);

    // Cálculo de progreso
    const totalSeconds = getTotalSeconds(mode);
    const currentSeconds = minutes * 60 + seconds;
    const progress = Math.round((currentSeconds / totalSeconds) * 100);

    return (
        <>
            <h3 className="text-lg font-medium ml-4 mb-2">Pomodoro</h3>
            <Card className="flex items-center justify-center gap-20">
                <div className="flex flex-col gap-5">
                    {/* Botones de modo */}
                    <ButtonWithIcon
                        onClick={() => handleChangeMode(MODES.WORK.name)}
                        bgColor={mode === MODES.WORK.name ? "bg-primary-900" : "bg-primary-700/60"}
                        buttonText={MODES.WORK.label}
                        textColor={mode === MODES.WORK.name ? "text-tertiary-50" : "text-primary-900/80"}
                        iconColor={mode === MODES.WORK.name ? "text-primary-900" : "text-secondary-500"}
                        buttonColor={mode === MODES.WORK.name ? "bg-tertiary-300" : "bg-transparent"}
                        icon={MODES.WORK.icon}
                        size="small"
                    />
                    <ButtonWithIcon
                        onClick={() => handleChangeMode(MODES.SHORT_BREAK.name)}
                        bgColor={mode === MODES.SHORT_BREAK.name ? "bg-secondary-500" : "bg-secondary-200"}
                        buttonText={MODES.SHORT_BREAK.label}
                        textColor={mode === MODES.SHORT_BREAK.name ? "text-tertiary-50" : "text-primary-900/80"}
                        iconColor={mode === MODES.SHORT_BREAK.name ? "text-tertiary-50" : "text-secondary-500"}
                        buttonColor={mode === MODES.SHORT_BREAK.name ? "bg-secondary-700" : "bg-transparent"}
                        icon={MODES.SHORT_BREAK.icon}
                        size="small"
                    />
                    <ButtonWithIcon
                        onClick={() => handleChangeMode(MODES.LONG_BREAK.name)}
                        bgColor={mode === MODES.LONG_BREAK.name ? "bg-tertiary-300" : "bg-tertiary-100"}
                        buttonText={MODES.LONG_BREAK.label}
                        textColor={mode === MODES.LONG_BREAK.name ? "text-primary-900" : "text-primary-900/80"}
                        iconColor={mode === MODES.LONG_BREAK.name ? "text-tertiary-50" : "text-secondary-500"}
                        buttonColor={mode === MODES.LONG_BREAK.name ? "bg-primary-900" : "bg-transparent"}
                        icon={MODES.LONG_BREAK.icon}
                        size="small"
                    />
                </div>
                <div className="flex-col items-center">
                    <CircularProgress
                        value={progress}
                        text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                        size={150}
                        strokeWidth={5}
                        color={mode === MODES.WORK.name ? MODES.WORK.strokeColor : mode === MODES.SHORT_BREAK.name ? MODES.SHORT_BREAK.strokeColor : MODES.LONG_BREAK.strokeColor}
                    />
                    <div className="flex gap-6 justify-center mt-4">
                        <Button type="button" color="primary" form="pill" onClick={handleToggle}>
                            {isActive ? <Pause /> : <Play />}
                        </Button>
                        <Button type="button" color="secondary" form="pill" onClick={handleReset}>
                            <RotateCcw />
                        </Button>
                    </div>
                    <div className="text-sm text-primary-900/80 mt-4">
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