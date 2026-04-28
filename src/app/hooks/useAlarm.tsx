import { useState } from "react";
import { alarmService } from "../features/pomodoro/services/AlarmService";

export const useAlarm = () => {
    const [volume, setVolumeState] = useState<number>(1);
    const [muted, setMuted] = useState<boolean>(false);

    const setVolume = (v: number) => {
        const clamped = Math.min(1, Math.max(0, v));
        setVolumeState(clamped);
        alarmService.setVolume(clamped);
    };

    const toggleMute = () => {
        setMuted((m) => {
            alarmService.setMuted(!m);
            return !m;
        });
    };

    return { 
        play: () => alarmService.play(), 
        volume, 
        setVolume, 
        muted, 
        toggleMute 
    };
};