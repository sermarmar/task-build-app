// alarmService.ts
class AlarmService {
    private volume: number = 1;
    private muted: boolean = false;
    private ctx: AudioContext | null = null;

    private getCtx(): AudioContext {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.ctx;
    }

    setVolume(v: number) { this.volume = Math.min(1, Math.max(0, v)); }
    setMuted(m: boolean) { this.muted = m; }

    play(): void {
        if (this.muted) return;
        const ctx = this.getCtx();
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

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
                gEnv.gain.linearRampToValueAtTime(this.volume * 0.5, now + delay + 0.01);
                gEnv.gain.exponentialRampToValueAtTime(0.001, now + delay + decay);
                osc.start(now + delay);
                osc.stop(now + delay + decay + 0.05);
            });
        });
    }
}

export const alarmService = new AlarmService();