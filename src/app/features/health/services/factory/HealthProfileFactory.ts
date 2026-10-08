import type { HealthProfileEntity } from '@/app/infra/entities/HealthProfileEntity';
import { EMPTY_HEALTH_PROFILE, type HealthProfile } from '../../models/HealthProfile';

// PostgREST puede devolver numeric como string y el formulario deja NaN en los campos vacíos
const toNumber = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
};

// time de Postgres llega como 'HH:MM:SS'; el input type="time" trabaja con 'HH:MM'
const toTime = (value: string | null | undefined): string | null => value ? value.slice(0, 5) : null;

export const HealthProfileFactory = {

    mapFromEntity: (entity: HealthProfileEntity | null): HealthProfile => {
        if (!entity) return EMPTY_HEALTH_PROFILE;
        return {
            heightCm: toNumber(entity.height_cm),
            weightKg: toNumber(entity.weight_kg),
            targetWeightKg: toNumber(entity.target_weight_kg),
            sex: entity.sex,
            activityLevel: entity.activity_level,
            sleepGoalHours: toNumber(entity.sleep_goal_hours),
            bedtime: toTime(entity.bedtime),
            wakeTime: toTime(entity.wake_time),
            waterGoalLiters: toNumber(entity.water_goal_liters),
            stressLevel: toNumber(entity.stress_level),
            energyLevel: toNumber(entity.energy_level),
            practicesMeditation: entity.practices_meditation,
            attendsTherapy: entity.attends_therapy,
        };
    },

    mapToEntity: (userId: string, profile: HealthProfile): HealthProfileEntity => ({
        user_id: userId,
        height_cm: toNumber(profile.heightCm),
        weight_kg: toNumber(profile.weightKg),
        target_weight_kg: toNumber(profile.targetWeightKg),
        sex: profile.sex,
        activity_level: profile.activityLevel,
        sleep_goal_hours: toNumber(profile.sleepGoalHours),
        bedtime: toTime(profile.bedtime),
        wake_time: toTime(profile.wakeTime),
        water_goal_liters: toNumber(profile.waterGoalLiters),
        stress_level: toNumber(profile.stressLevel),
        energy_level: toNumber(profile.energyLevel),
        practices_meditation: profile.practicesMeditation,
        attends_therapy: profile.attendsTherapy,
        updated_at: new Date().toISOString(),
    }),

};
