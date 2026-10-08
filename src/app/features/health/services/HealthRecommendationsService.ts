import type { HealthProfile } from "../models/HealthProfile";
import type { HealthMetrics } from "./HealthMetricsService";
import { formatHours } from "../helpers/formatters";

export type RecommendationKind = 'water' | 'sleep' | 'weight' | 'stress' | 'energy' | 'activity' | 'profile';

export interface HealthRecommendation {
    kind: RecommendationKind;
    tag: string;
    title: string;
    description: string;
    detail?: string;
}

const fmt = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 1 });
const filled = (n: number | null): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

const toClock = (minutes: number) => {
    const m = ((minutes % 1440) + 1440) % 1440;
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

// Consejos generales a partir de los datos del perfil; no son pautas médicas
export const HealthRecommendationsService = {

    getRecommendations: (profile: HealthProfile, metrics: HealthMetrics): HealthRecommendation[] => {
        const recommendations: HealthRecommendation[] = [];

        if (!filled(profile.heightCm) || !filled(profile.weightKg)) {
            recommendations.push({
                kind: 'profile',
                tag: 'Perfil',
                title: 'Completa tus datos',
                description: 'Añade tu altura y tu peso para calcular tu IMC, tu rango de peso saludable y el agua que necesitas.',
            });
        }

        if (metrics.waterLiters) {
            const goalBelow = filled(profile.waterGoalLiters) && profile.waterGoalLiters < metrics.waterLiters;
            recommendations.push({
                kind: 'water',
                tag: 'Hidratación',
                title: `Bebe unos ${fmt(metrics.waterLiters)} L al día`,
                description: goalBelow
                    ? `Tu objetivo de ${fmt(profile.waterGoalLiters!)} L se queda corto para tu peso. Ten una botella a mano y bebe entre horas.`
                    : 'Reparte el agua a lo largo del día y aumenta la cantidad cuando hagas ejercicio o haga calor.',
                detail: filled(profile.waterGoalLiters) ? `Tu objetivo: ${fmt(profile.waterGoalLiters)} L` : undefined,
            });
        }

        if (metrics.sleepHours !== null && filled(profile.sleepGoalHours) && profile.wakeTime) {
            const [wh, wm] = profile.wakeTime.split(':').map(Number);
            const idealBedtime = toClock(wh * 60 + wm - Math.round(profile.sleepGoalHours * 60));
            const short = metrics.sleepHours < profile.sleepGoalHours;
            recommendations.push({
                kind: 'sleep',
                tag: 'Sueño',
                title: short ? 'Adelanta tu hora de dormir' : 'Mantén tu horario de sueño',
                description: short
                    ? `Para dormir ${fmt(profile.sleepGoalHours)} h y levantarte a las ${profile.wakeTime}, acuéstate sobre las ${idealBedtime}.`
                    : `Tu horario cubre tus ${fmt(profile.sleepGoalHours)} h. Intenta mantenerlo también el fin de semana.`,
                detail: `Duermes ${formatHours(metrics.sleepHours)}`,
            });
        }

        if (metrics.bmiCategory && metrics.healthyWeight) {
            const { min, max } = metrics.healthyWeight;
            const range = `${fmt(Math.round(min))}–${fmt(Math.round(max))} kg`;
            const healthy = metrics.bmiCategory.tone === 'healthy';
            const toTarget = filled(profile.targetWeightKg) && filled(profile.weightKg)
                ? Math.abs(profile.weightKg - profile.targetWeightKg)
                : null;
            recommendations.push({
                kind: 'weight',
                tag: 'Peso',
                title: healthy ? 'Estás en tu rango saludable' : 'Acércate a tu rango saludable',
                description: toTarget
                    ? `Te quedan ${fmt(toTarget)} kg para tu objetivo. Mejor poco a poco, combinando alimentación y movimiento.`
                    : `El rango saludable para tu altura es ${range}. Fija un objetivo dentro de él.`,
                detail: `IMC ${fmt(metrics.bmi!)}`,
            });
        }

        if (profile.stressLevel !== null && profile.stressLevel >= 4) {
            recommendations.push({
                kind: 'stress',
                tag: 'Bienestar',
                title: 'Baja revoluciones',
                description: profile.practicesMeditation
                    ? 'Mantén tu práctica de meditación y añade pausas cortas entre tareas.'
                    : 'Prueba 10 minutos de respiración o meditación al día.'
                        + (profile.attendsTherapy ? '' : ' Si el estrés no baja, hablar con un profesional puede ayudarte.'),
                detail: `Estrés ${profile.stressLevel}/5`,
            });
        }

        if (profile.energyLevel !== null && profile.energyLevel <= 2) {
            recommendations.push({
                kind: 'energy',
                tag: 'Energía',
                title: 'Recarga tu energía',
                description: 'Cuida la hora a la que te acuestas, sal a la luz natural por la mañana y haz pausas activas.',
                detail: `Energía ${profile.energyLevel}/5`,
            });
        }

        if (profile.activityLevel === 'sedentary' || profile.activityLevel === 'light') {
            recommendations.push({
                kind: 'activity',
                tag: 'Actividad',
                title: 'Muévete un poco más',
                description: 'Intenta sumar 30 minutos de actividad moderada al día: caminar a buen ritmo ya cuenta.',
            });
        }

        return recommendations;
    },

};
