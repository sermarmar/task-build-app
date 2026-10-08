import { Sprout } from "lucide-react";
import { Card } from "@/app/components/ux/Card";
import { Skeleton } from "@/app/components/ux/Skeleton";
import type { WellbeingArea } from "../hooks/useMentalHealth";

interface MentalHealthBoardProps {
    areas: WellbeingArea[];
    balance: number;
    isLoading: boolean;
}

const ARC = "M 24 150 A 116 116 0 0 1 256 150";
const STROKE = 30;
const OUTER = 116 + STROKE / 2;
const INNER = 116 - STROKE / 2;
// Separación entre áreas y ancho mínimo de cada una, en px
const GAP = 5;
const MIN_WIDTH = 16;

// Porcentaje del recorrido que ocupan `px` píxeles a un radio dado
const toPercent = (px: number, radius: number) => (px * 100) / (Math.PI * radius);

// Punto del arco (centro 140,150) a un porcentaje del recorrido: 0 = extremo izquierdo, 100 = derecho
const point = (percent: number, radius: number) => {
    const angle = (Math.PI * percent) / 100;
    return `${140 - radius * Math.cos(angle)} ${150 - radius * Math.sin(angle)}`;
};

// Tramo del anillo entre dos porcentajes con las cuatro esquinas redondeadas.
// Con round = medio grosor los extremos quedan como semicírculos
const segmentPath = (from: number, to: number, round: number) => {
    const corner = `A ${round} ${round} 0 0 1`;
    return [
        `M ${point(from + toPercent(round, OUTER), OUTER)}`,
        `A ${OUTER} ${OUTER} 0 0 1 ${point(to - toPercent(round, OUTER), OUTER)}`,
        `${corner} ${point(to, OUTER - round)}`,
        `L ${point(to, INNER + round)}`,
        `${corner} ${point(to - toPercent(round, INNER), INNER)}`,
        `A ${INNER} ${INNER} 0 0 0 ${point(from + toPercent(round, INNER), INNER)}`,
        `${corner} ${point(from, INNER + round)}`,
        `L ${point(from, OUTER - round)}`,
        `${corner} ${point(from + toPercent(round, OUTER), OUTER)}`,
        'Z',
    ].join(' ');
};

// Reparte `total` en proporción a `weights` sin bajar de `min`: las que se quedarían cortas
// se fijan al mínimo y el resto se reparte entre las demás, así la suma sigue siendo `total`
const distribute = (weights: number[], total: number, min: number): number[] => {
    if (weights.length * min >= total) return weights.map(() => total / weights.length);
    const fixed = new Set<number>();
    for (;;) {
        const room = total - fixed.size * min;
        const freeWeight = weights.reduce((sum, weight, i) => fixed.has(i) ? sum : sum + weight, 0);
        const lengths = weights.map((weight, i) => fixed.has(i) ? min : (weight / freeWeight) * room);
        const tooShort = lengths.findIndex((length, i) => !fixed.has(i) && length < min);
        if (tooShort === -1) return lengths;
        fixed.add(tooShort);
    }
};

export const MentalHealthBoard: React.FC<MentalHealthBoardProps> = ({ areas, balance, isLoading }) => {

    // Las áreas se reparten todo el arco según sus puntos; el balance solo se muestra en el porcentaje
    const scored = areas.filter(area => area.value > 0);
    const gap = toPercent(GAP, 116);
    const available = 100 - gap * (scored.length - 1);
    const lengths = distribute(scored.map(area => area.value), available, toPercent(MIN_WIDTH, INNER));
    const segments = scored.reduce<(WellbeingArea & { from: number; to: number })[]>((acc, area, i) => {
        const from = acc.length ? acc[acc.length - 1].to + gap : 0;
        return [...acc, { ...area, from, to: from + lengths[i] }];
    }, []);

    const tabTitle = (
        <>
            <Sprout />
            Salud mental
        </>
    );

    return (
        <Card tabTitle={tabTitle} tabSubtitle="Equilibrio entre tus áreas este mes" className="flex items-center justify-center">
            {isLoading ? (
                <Skeleton className="w-64 h-36 rounded-t-full" />
            ) : (
                <div className="relative w-full max-w-[280px]">
                    <svg viewBox="0 0 280 170" className="w-full overflow-visible" role="img" aria-label={`Balance de salud mental: ${balance}%`}>
                        {segments.length === 0 && (
                            <path d={ARC} fill="none" stroke="var(--color-cream-100)" strokeWidth={STROKE} strokeLinecap="round" />
                        )}
                        {/* Degradado clay: luz arriba a la izquierda y el tono del área más intenso abajo a la derecha */}
                        <defs>
                            {segments.map((segment, i) => (
                                <linearGradient key={segment.label} id={`mental-health-area-${i}`} x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" style={{ stopColor: `color-mix(in srgb, ${segment.color} 40%, white)` }} />
                                    <stop offset="100%" style={{ stopColor: `color-mix(in srgb, ${segment.color} 85%, white)` }} />
                                </linearGradient>
                            ))}
                        </defs>
                        {segments.map((segment, i) => {
                            // Un tramo más corto que el grosor no admite extremos del todo redondos
                            const length = ((segment.to - segment.from) * Math.PI * INNER) / 100;
                            return (
                                <path
                                    key={segment.label}
                                    d={segmentPath(segment.from, segment.to, Math.min(STROKE / 2, length / 2))}
                                    fill={`url(#mental-health-area-${i})`}
                                >
                                    <title>{`${segment.label}: ${Math.round(segment.value)} pts`}</title>
                                </path>
                            );
                        })}
                    </svg>
                    <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-1">
                        <span className="size-12 rounded-full clay-knob flex items-center justify-center text-tertiary-500">
                            <Sprout size={22} />
                        </span>
                        <span className="font-heading text-4xl font-bold text-primary-950">{balance}%</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
