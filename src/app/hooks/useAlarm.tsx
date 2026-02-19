import { useRef, useState } from "react";

interface UseAlarmReturn {
  play:            () => void;
  volume:          number;
  setVolume:       (v: number) => void;
  muted:           boolean;
  toggleMute:      () => void;
  customFileName:  string | null;
  loadCustomFile:  (file: File) => Promise<void>;
  clearCustomFile: () => void;
}

export const useAlarm = () => {
    const [volume, setVolumeState] = useState<number>(1);
    const [muted,  setMuted] = useState<boolean>(false);
    const ctxRef = useRef<AudioContext | null>(null);
    const customBufferRef = useRef<AudioBuffer | null>(null);
    const customAudioRef = useRef<HTMLAudioElement | null>(null);

    const getCtx = (): AudioContext => {
        if (!ctxRef.current) {
            ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return ctxRef.current;
    };

    const [sound, setSound] = useState<string>("bell");
    const [customFileName, setCustomFileName] = useState<string | null>(null);

    const loadCustomFile = async (): Promise<void> => {
        const audio = new Audio("../assets/alarma.mp3");
        audio.volume = volume;
        customAudioRef.current = audio;

        try {
            const ctx        = getCtx();
            const response   = await fetch("../assets/alarma.mp3");
            const arrayBuf   = await response.arrayBuffer();
            const decoded    = await ctx.decodeAudioData(arrayBuf);
            customBufferRef.current = decoded;
            setCustomFileName("alarma.mp3");
            setSound("custom");
        } catch {
            customBufferRef.current = null;
        }
    };

    const clearCustomFile = (): void => {
        customBufferRef.current = null;
        customAudioRef.current = null;
        setCustomFileName(null);
        setSound("bell");
    };

    const play = (): void => {
        if (muted) return;

        // Custom audio file
        if (sound === "custom") {
            if (customBufferRef.current) {
                const ctx  = getCtx();
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(volume, ctx.currentTime);
                gain.connect(ctx.destination);
                const src = ctx.createBufferSource();
                src.buffer = customBufferRef.current;
                src.connect(gain);
                src.start();
            } else if (customAudioRef.current) {
                customAudioRef.current.volume = volume;
                customAudioRef.current.currentTime = 0;
                customAudioRef.current.play().catch(() => {});
            }
            return;
        }

        // Synthesised sounds (Web Audio API)
        const ctx  = getCtx();
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (sound === "bell") {
            const strikes: [number, number, number][] = [
                [880,  0.00, 1.6],
                [880,  0.55, 1.6],
                [1320, 1.10, 1.2],
            ];
            strikes.forEach(([freq, delay, decay]) => {
                [1, 1.005].forEach((detune) => {
                    const osc  = ctx.createOscillator();
                    const gEnv = ctx.createGain();
                    osc.connect(gEnv);
                    gEnv.connect(gain);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq * detune, now + delay);
                    gEnv.gain.setValueAtTime(0, now + delay);
                    gEnv.gain.linearRampToValueAtTime(volume * 0.5, now + delay + 0.01);
                    gEnv.gain.exponentialRampToValueAtTime(0.001,   now + delay + decay);
                    osc.start(now + delay);
                    osc.stop(now  + delay + decay + 0.05);
                });
            });

        } else {
            const osc  = ctx.createOscillator();
            const gEnv = ctx.createGain();
            osc.connect(gEnv);
            gEnv.connect(gain);
            osc.type = "sine";
            osc.frequency.setValueAtTime(1047, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
            gEnv.gain.setValueAtTime(0,       now);
            gEnv.gain.linearRampToValueAtTime(volume, now + 0.015);
            gEnv.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            osc.start(now);
            osc.stop(now + 2.1);
        }
    };

    const setVolume  = (v: number): void => setVolumeState(Math.min(1, Math.max(0, v)));
    const toggleMute = (): void => setMuted((m) => !m);

    return { play, volume, setVolume, muted, toggleMute, customFileName, loadCustomFile, clearCustomFile };
}