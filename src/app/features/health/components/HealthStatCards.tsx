import { Droplets, Gauge, MoonStar, Scale } from "lucide-react";
import { StatTile } from "@/app/components/ux/StatTile";
import type { HealthProfile } from "../models/HealthProfile";
import type { HealthMetrics } from "../services/HealthMetricsService";
import { formatHours, formatNumber, isFilled } from "../helpers/formatters";

interface HealthStatCardsProps {
    profile: HealthProfile;
    metrics: HealthMetrics;
}

const EMPTY_HINT = 'Añádelo en tus datos';

export const HealthStatCards: React.FC<HealthStatCardsProps> = ({ profile, metrics }) => {
    const waterGoal = isFilled(profile.waterGoalLiters) ? profile.waterGoalLiters : null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatTile
                icon={<Scale />}
                label="Peso"
                value={isFilled(profile.weightKg) ? `${formatNumber(profile.weightKg)} kg` : '—'}
                hint={isFilled(profile.targetWeightKg) ? `Objetivo: ${formatNumber(profile.targetWeightKg)} kg` : isFilled(profile.weightKg) ? 'Sin objetivo' : EMPTY_HINT}
                tone="peach"
            />
            <StatTile
                icon={<Gauge />}
                label="IMC"
                value={metrics.bmi ? formatNumber(metrics.bmi) : '—'}
                hint={metrics.bmiCategory?.label ?? 'Necesita altura y peso'}
                tone="blue"
            />
            <StatTile
                icon={<Droplets />}
                label="Agua al día"
                value={waterGoal ? `${formatNumber(waterGoal)} L` : metrics.waterLiters ? `${formatNumber(metrics.waterLiters)} L` : '—'}
                hint={metrics.waterLiters ? `Recomendado: ${formatNumber(metrics.waterLiters)} L` : EMPTY_HINT}
                tone="lilac"
            />
            <StatTile
                icon={<MoonStar />}
                label="Sueño"
                value={metrics.sleepHours !== null ? formatHours(metrics.sleepHours) : '—'}
                hint={isFilled(profile.sleepGoalHours) ? `Objetivo: ${formatNumber(profile.sleepGoalHours)} h` : metrics.sleepHours !== null ? 'Según tu horario' : EMPTY_HINT}
                tone="rose"
            />
        </div>
    );
};
