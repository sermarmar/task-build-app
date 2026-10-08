import { useState } from "react";
import { useAuth } from "../contexts/auth/useAuth";
import { PageHeader } from "../components/template/PageHeader";
import { Skeleton } from "../components/ux/Skeleton";
import { useHealthProfile } from "../features/health/hooks/useHealthProfile";
import { HealthMetricsService } from "../features/health/services/HealthMetricsService";
import { HealthRecommendationsService } from "../features/health/services/HealthRecommendationsService";
import { HealthStatCards } from "../features/health/components/HealthStatCards";
import { HealthProfileModal } from "../features/health/components/HealthProfileModal";
import { RecommendationsBoard } from "../features/health/components/RecommendationsBoard";
import { ProfileCard } from "../features/profile/components/ProfileCard";
import { WeeklyActivityChart } from "../features/map-activities/components/WeeklyActivityChart";
import { RecentActivityBoard } from "../features/map-activities/components/RecentActivityBoard";
import { GroupSummaryRow } from "../features/group/components/GroupSummaryRow";

export const UserPage: React.FC = () => {
    const { user } = useAuth();
    const { profile, isLoading, isSaving, error, save } = useHealthProfile(user?.id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const metrics = HealthMetricsService.getMetrics(profile, user?.birthDate);
    const completion = HealthMetricsService.getCompletion(profile, user?.birthDate);
    const recommendations = HealthRecommendationsService.getRecommendations(profile, metrics);

    return (
        <div className="flex flex-col gap-6 pb-4">
            <PageHeader title="Tu perfil" subtitle="Tu salud física y mental de un vistazo." />

            {error && <p role="alert" className="text-sm font-bold text-accent-blossom-700">{error.message}.</p>}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-3xl" />)}
                </div>
            ) : (
                <HealthStatCards profile={profile} metrics={metrics} />
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 items-start">
                <div className="flex flex-col gap-6">
                    <ProfileCard profile={profile} metrics={metrics} completion={completion} onEdit={() => setIsModalOpen(true)} />
                    <RecentActivityBoard />
                </div>

                <div className="flex flex-col gap-6 min-w-0">
                    <WeeklyActivityChart />
                    {!isLoading && <RecommendationsBoard recommendations={recommendations} onEdit={() => setIsModalOpen(true)} />}
                </div>
            </div>

            <GroupSummaryRow />

            <HealthProfileModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                profile={profile}
                birthDate={user?.birthDate}
                isSaving={isSaving}
                onSave={save}
            />
        </div>
    );
};
