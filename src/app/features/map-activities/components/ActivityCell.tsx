import { DayActivity } from "../models/MapActivity";
import { cn } from "@sglara/cn";
import { LEVEL_CLASSES } from "@/app/shared/constants";
import { Tooltip } from "@/app/components/ux/Tooltip";

interface ActivityCellProps {
    day: DayActivity | null
}

export const ActivityCell: React.FC<ActivityCellProps> = ({ day }) => {
    if (!day) return <div className="w-3 h-3 rounded-sm" />;

    const formatted = new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const tooltipContent = (
        <span>
            <span className="font-semibold text-text-DEFAULT">
                {day.count} {day.count === 1 ? 'actividad' : 'actividades'}
            </span>
            <span className="text-text-DEFAULT/50 ml-1">— {formatted}</span>
        </span>
    );

    return (
        <Tooltip content={tooltipContent} placement="top" arrow>
            <div
                className={cn(
                    'w-3 h-3 rounded-sm cursor-default transition-opacity duration-100 hover:opacity-80',
                    LEVEL_CLASSES[day.level],
                )}
            />
        </Tooltip>
    );
}