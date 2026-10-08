import { LogOut, Mail, PencilLine } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/contexts/auth/useAuth";
import { Card } from "@/app/components/ux/Card";
import { Button } from "@/app/components/ux/Button";
import { CircularProgress } from "@/app/components/ux/CircularProgress";
import type { HealthProfile } from "@/app/features/health/models/HealthProfile";
import type { HealthMetrics } from "@/app/features/health/services/HealthMetricsService";
import { isFilled } from "@/app/features/health/helpers/formatters";

interface ProfileCardProps {
    profile: HealthProfile;
    metrics: HealthMetrics;
    completion: number;
    onEdit: () => void;
}

const MiniRing: React.FC<{ label: string; value: number; text: string; color: string }> = ({ label, value, text, color }) => (
    <div className="flex flex-col items-center gap-2">
        <CircularProgress value={value} size={76} strokeWidth={7} color={color} knob text={text} textClassName="text-sm" />
        <span className="text-xs font-bold text-primary-500">{label}</span>
    </div>
);

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, metrics, completion, onEdit }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const initials = `${user?.name?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase();
    const sleepPercent = metrics.sleepHours !== null && isFilled(profile.sleepGoalHours)
        ? Math.min(100, Math.round((metrics.sleepHours / profile.sleepGoalHours) * 100))
        : null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Card className="flex flex-col items-center text-center gap-5">
            <div className="flex flex-col items-center gap-2">
                <CircularProgress
                    value={completion}
                    size={156}
                    strokeWidth={8}
                    color="var(--color-lilac-500)"
                    text={
                        <span className="size-28 rounded-full clay-blue shadow-clay-pressed flex items-center justify-center text-4xl text-secondary-950">
                            {initials || '·'}
                        </span>
                    }
                />
                <span className="text-xs font-bold text-primary-400">Perfil de salud al {completion}%</span>
            </div>

            <div>
                <h2 className="font-heading text-xl font-bold text-primary-950">{`${user?.name ?? ''} ${user?.lastName ?? ''}`.trim()}</h2>
                <p className="text-sm text-primary-500">
                    @{user?.username}{metrics.age !== null && ` · ${metrics.age} años`}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
                <MiniRing label="Energía" value={(profile.energyLevel ?? 0) * 20} text={profile.energyLevel ? `${profile.energyLevel}/5` : '—'} color="var(--color-secondary-500)" />
                <MiniRing label="Estrés" value={(profile.stressLevel ?? 0) * 20} text={profile.stressLevel ? `${profile.stressLevel}/5` : '—'} color="var(--color-accent-blossom-500)" />
                <MiniRing label="Sueño" value={sleepPercent ?? 0} text={sleepPercent !== null ? `${sleepPercent}%` : '—'} color="var(--color-tertiary-500)" />
            </div>

            <Button type="button" color="tertiary" form="rounded" className="w-full justify-center" onClick={onEdit}>
                <PencilLine size={17} />
                Editar datos de salud
            </Button>

            <div className="w-full border-t border-primary-100 pt-4 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-primary-500 min-w-0">
                    <Mail size={15} className="shrink-0 text-tertiary-500" />
                    <span className="truncate">{user?.email}</span>
                </span>
                <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                    className="size-9 shrink-0 rounded-full clay-knob flex items-center justify-center text-accent-blossom-600 hover:text-accent-blossom-800 transition cursor-pointer"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </Card>
    );
};
