import { ACTIVITY_LEVELS, type HealthProfile } from "../models/HealthProfile";

export type BmiTone = 'low' | 'healthy' | 'high' | 'veryHigh';

export interface HealthMetrics {
    age: number | null;
    bmi: number | null;
    bmiCategory: { label: string; tone: BmiTone } | null;
    healthyWeight: { min: number; max: number } | null;
    waterLiters: number | null;
    dailyCalories: number | null;
    sleepHours: number | null;
}

const valid = (n: number | null | undefined): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;
const round1 = (n: number) => Math.round(n * 10) / 10;

const getAge = (birthDate?: string | null): number | null => {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const birthdayPassed = today.getMonth() > birth.getMonth()
        || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    if (!birthdayPassed) age--;
    return age;
};

// Rangos de la OMS para adultos
const getBmiCategory = (bmi: number): { label: string; tone: BmiTone } => {
    if (bmi < 18.5) return { label: 'Bajo peso', tone: 'low' };
    if (bmi < 25)   return { label: 'Peso saludable', tone: 'healthy' };
    if (bmi < 30)   return { label: 'Sobrepeso', tone: 'high' };
    return { label: 'Obesidad', tone: 'veryHigh' };
};

// Mifflin-St Jeor: solo tiene fórmula para sexo biológico, con "prefiero no decirlo" no se calcula
const getDailyCalories = (profile: HealthProfile, age: number | null): number | null => {
    const activity = ACTIVITY_LEVELS.find(a => a.value === profile.activityLevel);
    if (!valid(profile.weightKg) || !valid(profile.heightCm) || !age || !activity) return null;
    if (profile.sex !== 'female' && profile.sex !== 'male') return null;

    const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * age;
    const bmr = profile.sex === 'male' ? base + 5 : base - 161;
    return Math.round((bmr * activity.factor) / 10) * 10;
};

const getSleepHours = (bedtime: string | null, wakeTime: string | null): number | null => {
    if (!bedtime || !wakeTime) return null;
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wakeTime.split(':').map(Number);
    let minutes = (wh * 60 + wm) - (bh * 60 + bm);
    if (minutes <= 0) minutes += 24 * 60;
    return minutes / 60;
};

// Campos que cuentan para el % de perfil completado (los booleanos siempre tienen valor)
const getCompletion = (profile: HealthProfile, birthDate?: string | null): number => {
    const fields = [
        profile.heightCm, profile.weightKg, profile.targetWeightKg, profile.sex, profile.activityLevel,
        profile.sleepGoalHours, profile.bedtime, profile.wakeTime, profile.waterGoalLiters,
        profile.stressLevel, profile.energyLevel, birthDate,
    ];
    const filledCount = fields.filter(f => f !== null && f !== undefined && f !== '' && !Number.isNaN(f)).length;
    return Math.round((filledCount / fields.length) * 100);
};

export const HealthMetricsService = {

    getAge,

    getCompletion,

    getMetrics: (profile: HealthProfile, birthDate?: string | null): HealthMetrics => {
        const age = getAge(birthDate);
        const heightM = valid(profile.heightCm) ? profile.heightCm / 100 : null;
        const bmi = heightM && valid(profile.weightKg) ? round1(profile.weightKg / (heightM * heightM)) : null;

        return {
            age,
            bmi,
            bmiCategory: bmi ? getBmiCategory(bmi) : null,
            healthyWeight: heightM ? { min: round1(18.5 * heightM * heightM), max: round1(24.9 * heightM * heightM) } : null,
            // Referencia habitual de ~35 ml por kg de peso
            waterLiters: valid(profile.weightKg) ? round1(profile.weightKg * 0.035) : null,
            dailyCalories: getDailyCalories(profile, age),
            sleepHours: getSleepHours(profile.bedtime, profile.wakeTime),
        };
    },

};
