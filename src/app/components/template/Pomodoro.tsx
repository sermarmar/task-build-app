import { ClockFading, Pause, Play, RotateCcw } from "lucide-react";
import { Card, CardBody, CardText, CardTitle } from "../ux/Card";
import type React from 'react';
import { Button } from "../ux/Button";
import { useEffect, useState } from "react";

export const Pomodoro: React.FC = () => {

    const WORK = 'work';
    const SHORT_BREAK = 'shortBreak';
    const LONG_BREAK = 'longBreak';
    const MINUTES_WORK = 25;
    const MINUTES_SHORT_BREAK = 5;
    const MINUTES_LONG_BREAK = 15;

    const [minutes, setMinutes] = useState<number>(25);
    const [seconds, setSeconds] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
    const [completedCycles, setCompletedCycles] = useState<number>(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if(isActive) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer completed
                        setIsActive(false);
                        retrieveTimerByMode(mode);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                    setCompletedCycles(prev => {
                        if (prev < 3 && mode === WORK) {
                            return prev + 1;
                        }
                        return prev;
                    });
                }
            }, 1000)
        } else if(interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, minutes, mode])
    

    const toggleTimer = () => {
        // Lógica para iniciar el temporizador
        setIsActive(!isActive);
    }

    const resetTimer = () => {
        // Lógica para reiniciar el temporizador
        setIsActive(false);
        retrieveTimerByMode(mode);
    }

    const changeMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
        setMode(newMode);
        retrieveTimerByMode(newMode);
        setIsActive(false);
    }

    const retrieveTimerByMode = (mode: 'work' | 'shortBreak' | 'longBreak') => {
        switch (mode) {
            case WORK:
                setMinutes(MINUTES_WORK);
                break;
            case SHORT_BREAK:
                setMinutes(MINUTES_SHORT_BREAK);
                break;
            case LONG_BREAK:
                setMinutes(MINUTES_LONG_BREAK);
                break;
        }
        setSeconds(0);
    }


    return (
        <Card>
            <CardTitle className="flex gap-2 items-center">
                <ClockFading />
                Pomodoro
            </CardTitle>
            <CardBody>
                <CardText className="flex flex-col justify-center">
                    <div className="flex justify-center gap-4">
                        <Button type="button" color={mode === WORK ? "primary" : "secondary"} className="w-full justify-center" onClick={() => changeMode(WORK)}>Trabajo</Button>
                        <Button type="button" color={mode === SHORT_BREAK ? "primary" : "secondary"} className="w-full justify-center" onClick={() => changeMode(SHORT_BREAK)}>Descanso</Button>
                        <Button type="button" color={mode === LONG_BREAK ? "primary" : "secondary"} className="w-full justify-center" onClick={() => changeMode(LONG_BREAK)}>Descanso largo</Button>
                    </div>
                    <div className="text-7xl font-bold text-center mt-8">
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </div>
                    <p className="text-center mt-2 text-text-muted">
                        Tiempo de trabajo
                    </p>
                    <div className="flex justify-center mt-4 gap-4">
                        <Button type="button" color="primary" onClick={() => toggleTimer()}>
                            {isActive ? <Pause /> : <Play />}
                            {isActive ? "Pausar" : "Iniciar"}
                        </Button>
                        <Button type="button" color="secondary" onClick={() => resetTimer()}>
                            <RotateCcw />
                            Reiniciar
                        </Button>
                    </div>
                    <p className="text-center mt-5 text-text-muted">
                        Cíclos completados: {completedCycles}
                    </p>
                </CardText>
            </CardBody>
            
        </Card>
    );
}