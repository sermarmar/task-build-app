export type Sex = 'female' | 'male' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface HealthProfile {
    heightCm: number | null;
    weightKg: number | null;
    targetWeightKg: number | null;
    sex: Sex | null;
    activityLevel: ActivityLevel | null;
    sleepGoalHours: number | null;
    bedtime: string | null;      // 'HH:MM'
    wakeTime: string | null;     // 'HH:MM'
    waterGoalLiters: number | null;
    stressLevel: number | null;  // 1-5
    energyLevel: number | null;  // 1-5
    practicesMeditation: boolean;
    attendsTherapy: boolean;
}

export const EMPTY_HEALTH_PROFILE: HealthProfile = {
    heightCm: null,
    weightKg: null,
    targetWeightKg: null,
    sex: null,
    activityLevel: null,
    sleepGoalHours: null,
    bedtime: null,
    wakeTime: null,
    waterGoalLiters: null,
    stressLevel: null,
    energyLevel: null,
    practicesMeditation: false,
    attendsTherapy: false,
};

export const SEX_OPTIONS: { value: Sex; label: string }[] = [
    { value: 'female', label: 'Mujer' },
    { value: 'male',   label: 'Hombre' },
    { value: 'other',  label: 'Prefiero no decirlo' },
];

// factor: multiplicador de actividad sobre el metabolismo basal (Mifflin-St Jeor)
export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; factor: number }[] = [
    { value: 'sedentary',   label: 'Sedentario', factor: 1.2   },
    { value: 'light',       label: 'Ligero',     factor: 1.375 },
    { value: 'moderate',    label: 'Moderado',   factor: 1.55  },
    { value: 'active',      label: 'Activo',     factor: 1.725 },
    { value: 'very_active', label: 'Muy activo', factor: 1.9   },
];
