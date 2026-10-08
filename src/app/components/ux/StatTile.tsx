import { cn } from "@/utils/cn";
import { Skeleton } from "./Skeleton";
import { CircularProgress } from "./CircularProgress";

// Degradados un tono más profundos que los pastel de fondo para que el contenido en blanco se lea
const TONES = {
    peach: 'clay-peach',
    blue:  'bg-gradient-to-br from-secondary-300 to-secondary-500',
    lilac: 'bg-gradient-to-br from-lilac-300 to-lilac-500',
    rose:  'bg-gradient-to-br from-accent-blossom-300 to-accent-blossom-500',
};

export type StatTileTone = keyof typeof TONES;

interface StatTileProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    hint: string;
    tone: StatTileTone;
    // 0-100: si se pasa, el icono va dentro de un anillo de progreso
    progress?: number;
    isLoading?: boolean;
}

export const StatTile: React.FC<StatTileProps> = ({ icon, label, value, hint, tone, progress, isLoading = false }) => (
    <article className={cn("flex items-center gap-4 rounded-3xl p-5 shadow-clay-pressed text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.12)]", TONES[tone])}>
        {progress === undefined ? (
            <span className="size-14 shrink-0 rounded-2xl bg-white/30 border border-white/50 flex items-center justify-center [&_svg]:size-7">
                {icon}
            </span>
        ) : (
            <CircularProgress
                value={isLoading ? 0 : progress}
                size={68}
                strokeWidth={6}
                color="#ffffff"
                trackColor="rgb(255 255 255 / 0.35)"
                textClassName="text-current"
                text={
                    <span className="size-12 rounded-full bg-white/30 border border-white/50 flex items-center justify-center [&_svg]:size-6">
                        {icon}
                    </span>
                }
            />
        )}
        <div className="ml-auto text-right min-w-0">
            <p className="text-sm font-bold opacity-90">{label}</p>
            {isLoading ? (
                <Skeleton className="h-9 w-20 my-0.5 ml-auto rounded-xl bg-white/40" />
            ) : (
                <p className="font-heading text-3xl font-bold leading-tight">{value}</p>
            )}
            <p className="text-xs font-bold opacity-80 truncate">{hint}</p>
        </div>
    </article>
);
