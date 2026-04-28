import { Bed, GlassWater, Laptop, Pause, Play, RotateCcw } from "lucide-react";
import type React from 'react';
import { useEffect, useState } from "react";
import { Card, CardBody, CardText } from '../components/ux/Card';
import { Button } from '../components/ux/Button';
import { useAlarm } from "../hooks/useAlarm";
import { CircularProgress } from "../components/ux/CircularProgress";
import { ButtonWithIcon } from '../components/ux/ButtonWithIcon';

const MODES = {
    WORK: {
        name: 'work',
        label: 'Trabajo',
        minutes: 25,
        icon: <Laptop />,
        strokeColor: "var(--color-primary-900)"
    },
    SHORT_BREAK: {
        name: 'shortBreak',
        label: 'Descanso',
        minutes: 5,
        icon: <GlassWater />,
        strokeColor: "var(--color-secondary-500)"
    },
    LONG_BREAK: {
        name: 'longBreak',
        label: 'Descanso largo',
        minutes: 15,
        icon: <Bed />,
        strokeColor: "var(--color-tertiary-300)"
    }
};

export const Pomodoro: React.FC = () => {

    const [minutes, setMinutes] = useState<number>(MODES.WORK.minutes);
    const [seconds, setSeconds] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>(MODES.WORK.name);
    const [completedCycles, setCompletedCycles] = useState<number>(0);
    const alarm = useAlarm();

    const getTotalSeconds = (mode: 'work' | 'shortBreak' | 'longBreak') => {
        switch (mode) {
            case MODES.WORK.name:       return MODES.WORK.minutes * 60;
            case MODES.SHORT_BREAK.name: return MODES.SHORT_BREAK.minutes * 60;
            case MODES.LONG_BREAK.name:  return MODES.LONG_BREAK.minutes * 60;
        }
    };

    const totalSeconds = getTotalSeconds(mode);
    const currentSeconds = minutes * 60 + seconds;
    const progress = Math.round((currentSeconds / totalSeconds) * 100);

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout> | null = null;
        if(isActive) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer completed
                        setIsActive(false);
                        if(mode === MODES.SHORT_BREAK.name) {
                            setMode(MODES.WORK.name);
                            retrieveTimerByMode(MODES.WORK.name);
                        } else if (mode === MODES.WORK.name) {
                            setMode(MODES.SHORT_BREAK.name);
                            retrieveTimerByMode(MODES.SHORT_BREAK.name);
                        }

                        setCompletedCycles(prev => {
                            if (prev < 5 && mode === MODES.WORK.name) {
                                return prev + 1;
                            }
                            return prev;
                        });
                        alarm.play();
                        
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                    /*setCompletedCycles(prev => {
                        if (prev < 3 && mode === MODES.WORK.name) {
                            return prev + 1;
                        }
                        return prev;
                    });*/
                }
            }, 1000)
        } else if(interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, minutes, mode, alarm]);
    

    const toggleTimer = () => {
        // Lógica para iniciar el temporizador
        setIsActive(!isActive);
    }

    const resetTimer = () => {
        // Lógica para reiniciar el temporizador
        setIsActive(false);
        retrieveTimerByMode(mode);
        const audio = new Audio('../../../assets/alarm.mp3');
        audio.currentTime = 0;
        audio.pause();
    }

    const changeMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
        setMode(newMode);
        retrieveTimerByMode(newMode);
        setIsActive(false);
    }

    const retrieveTimerByMode = (mode: 'work' | 'shortBreak' | 'longBreak') => {
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
    }


    return (
        <>
            <h3 className="text-lg font-medium ml-4 mb-2">Pomodoro</h3>
            <Card className="flex items-center justify-center gap-20">
               
                        <div className="flex flex-col gap-5">
                            <ButtonWithIcon 
                                onClick={() => changeMode(MODES.WORK.name)}
                                bgColor={mode === MODES.WORK.name ? "bg-primary-900" : "bg-primary-700/60"}
                                buttonText={MODES.WORK.label}
                                textColor={mode === MODES.WORK.name ? "text-tertiary-50" : "text-primary-900/80"}
                                iconColor={mode === MODES.WORK.name ? "text-primary-900" : "text-secondary-500"}
                                buttonColor={mode === MODES.WORK.name ? "bg-tertiary-300" : "bg-transparent"}
                                icon={MODES.WORK.icon}
                                size="small"
                            />
                            <ButtonWithIcon 
                                onClick={() => changeMode(MODES.SHORT_BREAK.name)}
                                bgColor={mode === MODES.SHORT_BREAK.name ? "bg-secondary-500" : "bg-secondary-200"}
                                buttonText={MODES.SHORT_BREAK.label}
                                textColor={mode === MODES.SHORT_BREAK.name ? "text-tertiary-50" : "text-primary-900/80"}
                                iconColor={mode === MODES.SHORT_BREAK.name ? "text-tertiary-50" : "text-secondary-500"}
                                buttonColor={mode === MODES.SHORT_BREAK.name ? "bg-secondary-700" : "bg-transparent"}
                                icon={MODES.SHORT_BREAK.icon}
                                size="small"
                            />
                            <ButtonWithIcon 
                                onClick={() => changeMode(MODES.LONG_BREAK.name)}
                                bgColor={mode === MODES.LONG_BREAK.name ? "bg-tertiary-300" : "bg-tertiary-100"}
                                buttonText={MODES.LONG_BREAK.label}
                                textColor={mode === MODES.LONG_BREAK.name ? "text-primary-900" : "text-primary-900/80"}
                                iconColor={mode === MODES.LONG_BREAK.name ? "text-tertiary-50" : "text-secondary-500"}
                                buttonColor={mode === MODES.LONG_BREAK.name ? "bg-primary-900" : "bg-transparent"}
                                icon={MODES.LONG_BREAK.icon}
                                size="small"
                            />
                            {/* <Button type="button" color={mode === MODES.WORK.name ? "primary" : "secondary"} className="w-full justify-center" onClick={() => changeMode(MODES.WORK.name)}>Trabajo</Button>
                            <Button type="button" color={mode === MODES.SHORT_BREAK.name ? "primary" : "secondary"} className="w-full justify-center" onClick={() => changeMode(MODES.SHORT_BREAK.name)}>Descanso</Button>
                            <Button type="button" color={mode === MODES.LONG_BREAK.name ? "primary" : "secondary"} className="w-full justify-center" onClick={() => changeMode(MODES.LONG_BREAK.name)}>Descanso largo</Button> */}
                        </div>
                        <div className="flex-col items-center">
                            <CircularProgress 
                                value={progress} 
                                text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`} size={150} 
                                strokeWidth={5} 
                                color={mode === MODES.WORK.name ? MODES.WORK.strokeColor : mode === MODES.SHORT_BREAK.name ? MODES.SHORT_BREAK.strokeColor : MODES.LONG_BREAK.strokeColor} />
                            <div className="flex gap-6 justify-center">
                                <Button type="button" color="primary" form="pill" onClick={() => toggleTimer()}>
                                    {isActive ? <Pause /> : <Play />}
                                </Button>
                                <Button type="button" color="secondary" form="pill" onClick={() => resetTimer()}>
                                    <RotateCcw />
                                </Button>
                            </div>
                            <div className="text-center mt-5 text-text-muted">
                                Cíclos completados: {completedCycles}
                            </div>
                        </div>

            </Card>
        </>
    );
}