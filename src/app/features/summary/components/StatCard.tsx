import { CircularProgress } from "@/app/components/ux/CircularProgress";
import { Skeleton } from "@/app/components/ux/Skeleton";

interface StatCardProps {
    icon: React.ReactNode;
    value: React.ReactNode;
    label: string;
    hint: string;
    progress: number;
    color: string;
    isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, hint, progress, color, isLoading }) => (
    <article className="flex items-center gap-4 rounded-3xl bg-surface shadow-clay px-5 py-4">
        <CircularProgress
            value={progress}
            size={76}
            strokeWidth={7}
            color={color}
            knob
            text={<span className="[&_svg]:size-6" style={{ color }}>{icon}</span>}
        />
        <div className="min-w-0">
            {isLoading ? (
                <Skeleton className="h-9 w-16 rounded-xl" />
            ) : (
                <p className="font-heading text-3xl font-bold text-primary-950 leading-none">{value}</p>
            )}
            <p className="mt-1.5 font-bold text-primary-800">{label}</p>
            <p className="text-xs text-primary-500 truncate">{hint}</p>
        </div>
    </article>
);
