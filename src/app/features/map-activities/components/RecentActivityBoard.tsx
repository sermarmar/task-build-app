import { History } from "lucide-react";
import { Card } from "@/app/components/ux/Card";
import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { formatRelativeTime } from "../helpers/relativeTime";
import type { RecentActivityItem } from "../services/RetrieveRecentActivityService";

const RecentActivityRow: React.FC<{ item: RecentActivityItem }> = ({ item }) => {
    return (
        <li className="flex items-start gap-3">
            <span
                className="size-10 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-clay-pressed [&_svg]:size-5"
                style={{ background: `linear-gradient(160deg, ${item.color}aa, ${item.color})` }}
            >
                <DynamicIcon name={item.icon} />
            </span>
            <div className="min-w-0">
                <p className="text-sm text-primary-600 leading-snug">
                    {item.type === 'habit' ? 'Has completado ' : 'Has terminado la tarea '}
                    <strong className="text-primary-950">{item.title}</strong>
                </p>
                <p className="text-xs text-primary-400 mt-0.5">{formatRelativeTime(item.completedAt)}</p>
            </div>
        </li>
    );
};

export const RecentActivityBoard: React.FC = () => {
    const { items, isLoading } = useRecentActivity();

    const tabTitle = (
        <>
            <History />
            Actividad reciente
        </>
    );

    return (
        <Card tabTitle={tabTitle}>
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-3 items-center">
                            <Skeleton className="size-10 rounded-xl shrink-0" />
                            <SkeletonLine className="flex-1" />
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <p className="text-sm text-primary-400 py-4">Completa un hábito o una tarea y aparecerá aquí.</p>
            ) : (
                <ul className="flex flex-col gap-4 py-1 max-h-[22rem] overflow-y-auto scrollbar-primary">
                    {items.map(item => <RecentActivityRow key={item.id} item={item} />)}
                </ul>
            )}
        </Card>
    );
};
