export interface HealthProfileEntity {
    user_id: string;
    height_cm: number | null;
    weight_kg: number | null;
    target_weight_kg: number | null;
    sex: 'female' | 'male' | 'other' | null;
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
    sleep_goal_hours: number | null;
    bedtime: string | null;
    wake_time: string | null;
    water_goal_liters: number | null;
    stress_level: number | null;
    energy_level: number | null;
    practices_meditation: boolean;
    attends_therapy: boolean;
    created_at?: string;
    updated_at?: string;
}
