import { Droplets, Gauge, MoonStar, Scale } from "lucide-react";
import { cn } from "@/utils/cn";
import type { HealthProfile } from "../models/HealthProfile";
import type { HealthMetrics } from "../services/HealthMetricsService";
import { formatHours, formatNumber, isFilled } from "../helpers/formatters";

interface HealthStatCardsProps {
    profile: HealthProfile;
    metrics: HealthMetrics;
}

const EMPTY_HINT = 'Añádelo en tus datos';

const StatTile: React.FC<{ icon: React.ReactNode; label: string; value: string; hint: string; className: string }> = ({ icon, label, value, hint, className }) => (
    <article className={cn("flex items-center gap-4 rounded-3xl p-5 shadow-clay-pressed", className)}>
        <span className="size-14 shrink-0 rounded-2xl bg-white/30 border border-white/50 flex items-center justify-center [&_svg]:size-7">
            {icon}
        </span>
        <div className="ml-auto text-right min-w-0">
            <p className="text-sm font-bold opacity-90">{label}</p>
            <p className="font-heading text-3xl font-bold leading-tight">{value}</p>
            <p className="text-xs font-bold opacity-80 truncate">{hint}</p>
        </div>
    </article>
);

export const HealthStatCards: React.FC<HealthStatCardsProps> = ({ profile, metrics }) => {
    const waterGoal = isFilled(profile.waterGoalLiters) ? profile.waterGoalLiters : null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatTile
                icon={<Scale />}
                label="Peso"
                value={isFilled(profile.weightKg) ? `${formatNumber(profile.weightKg)} kg` : '—'}
                hint={isFilled(profile.targetWeightKg) ? `Objetivo: ${formatNumber(profile.targetWeightKg)} kg` : isFilled(profile.weightKg) ? 'Sin objetivo' : EMPTY_HINT}
                className="clay-peach text-white"
            />
            <StatTile
                icon={<Gauge />}
                label="IMC"
                value={metrics.bmi ? formatNumber(metrics.bmi) : '—'}
                hint={metrics.bmiCategory?.label ?? 'Necesita altura y peso'}
                className="clay-blue text-secondary-950"
            />
            <StatTile
                icon={<Droplets />}
                label="Agua al día"
                value={waterGoal ? `${formatNumber(waterGoal)} L` : metrics.waterLiters ? `${formatNumber(metrics.waterLiters)} L` : '—'}
                hint={metrics.waterLiters ? `Recomendado: ${formatNumber(metrics.waterLiters)} L` : EMPTY_HINT}
                className="bg-gradient-to-br from-lilac-200 to-lilac-400 text-primary-950"
            />
            <StatTile
                icon={<MoonStar />}
                label="Sueño"
                value={metrics.sleepHours !== null ? formatHours(metrics.sleepHours) : '—'}
                hint={isFilled(profile.sleepGoalHours) ? `Objetivo: ${formatNumber(profile.sleepGoalHours)} h` : metrics.sleepHours !== null ? 'Según tu horario' : EMPTY_HINT}
                className="bg-gradient-to-br from-accent-blossom-200 to-accent-blossom-400 text-accent-blossom-950"
            />
        </div>
    );
};
