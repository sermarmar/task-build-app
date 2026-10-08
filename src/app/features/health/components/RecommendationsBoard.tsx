import { Activity, BatteryCharging, Brain, Droplets, MoonStar, Scale, UserRoundPen } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/app/components/ux/Button";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import type { HealthRecommendation, RecommendationKind } from "../services/HealthRecommendationsService";

interface RecommendationsBoardProps {
    recommendations: HealthRecommendation[];
    isLoading: boolean;
    onEdit: () => void;
}

const RecommendationCardSkeleton: React.FC = () => (
    <div className="flex flex-col gap-4 rounded-3xl bg-surface shadow-clay p-5">
        <div className="flex items-start justify-between gap-3">
            <SkeletonLine className="w-2/3 h-5" />
            <Skeleton className="size-12 shrink-0 rounded-2xl" />
        </div>
        <div className="flex flex-col gap-2">
            <SkeletonLine className="w-full h-3" />
            <SkeletonLine className="w-full h-3" />
            <SkeletonLine className="w-3/4 h-3" />
        </div>
        <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <SkeletonLine className="w-16" />
        </div>
    </div>
);

const KIND_STYLES: Record<RecommendationKind, { icon: React.ReactNode; badge: string; tag: string }> = {
    water:    { icon: <Droplets />,        badge: 'clay-blue text-secondary-950',                                         tag: 'bg-secondary-100 text-secondary-800' },
    sleep:    { icon: <MoonStar />,        badge: 'bg-gradient-to-br from-lilac-200 to-lilac-400 text-primary-950',      tag: 'bg-lilac-100 text-lilac-500' },
    weight:   { icon: <Scale />,           badge: 'clay-peach text-white',                                               tag: 'bg-tertiary-100 text-tertiary-700' },
    stress:   { icon: <Brain />,           badge: 'bg-gradient-to-br from-accent-blossom-200 to-accent-blossom-400 text-accent-blossom-950', tag: 'bg-accent-blossom-100 text-accent-blossom-700' },
    energy:   { icon: <BatteryCharging />, badge: 'bg-gradient-to-br from-cream-200 to-cream-400 text-tertiary-900',     tag: 'bg-cream-100 text-tertiary-800' },
    activity: { icon: <Activity />,        badge: 'bg-gradient-to-br from-emerald-100 to-emerald-300 text-emerald-900',  tag: 'bg-emerald-50 text-emerald-700' },
    profile:  { icon: <UserRoundPen />,    badge: 'clay-peach text-white',                                               tag: 'bg-tertiary-100 text-tertiary-700' },
};

export const RecommendationsBoard: React.FC<RecommendationsBoardProps> = ({ recommendations, isLoading, onEdit }) => (
    <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-bold text-primary-950">Recomendaciones para ti</h2>
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => <RecommendationCardSkeleton key={i} />)}
            </div>
        ) : recommendations.length === 0 ? (
            <p className="rounded-3xl bg-white/40 shadow-clay-inset p-6 text-sm font-bold text-primary-500">
                Todo en orden con tus datos actuales. Sigue así.
            </p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {recommendations.map(rec => {
                    const style = KIND_STYLES[rec.kind];
                    return (
                        <article key={rec.kind} className="flex flex-col gap-4 rounded-3xl bg-surface shadow-clay p-5">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-heading text-lg font-bold text-primary-950 leading-snug">{rec.title}</h3>
                                <span className={cn("size-12 shrink-0 rounded-2xl flex items-center justify-center shadow-clay-pressed [&_svg]:size-6", style.badge)}>
                                    {style.icon}
                                </span>
                            </div>
                            <p className="text-sm text-primary-600 leading-relaxed flex-1">{rec.description}</p>
                            <div className="flex items-center justify-between gap-3">
                                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide", style.tag)}>{rec.tag}</span>
                                {rec.kind === 'profile' ? (
                                    <Button type="button" color="light" form="rounded" size="sm" onClick={onEdit}>Completar datos</Button>
                                ) : (
                                    rec.detail && <span className="text-sm font-bold text-primary-700">{rec.detail}</span>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        )}
    </section>
);
