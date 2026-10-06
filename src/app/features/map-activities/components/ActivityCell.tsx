import { DayActivity } from "../models/MapActivity";
import { cn } from "@/utils/cn";
import { LEVEL_CLASSES } from "@/app/shared/constants";
import { Tooltip } from "@/app/components/ux/Tooltip";

interface ActivityCellProps {
    day: DayActivity | null
}

export const ActivityCell: React.FC<ActivityCellProps> = ({ day }) => {
    if (!day) return <div className="size-3 rounded-[4px]" />;

    const formatted = new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const tooltipContent = (
        <span>
            <span className="font-bold text-primary-950">
                {day.count} {day.count === 1 ? 'actividad' : 'actividades'}
            </span>
            <span className="text-primary-500 ml-1">— {formatted}</span>
        </span>
    );

    return (
        <Tooltip content={tooltipContent} placement="top" arrow>
            <div
                className={cn(
                    'size-3 rounded-[4px] cursor-default transition-transform duration-100 hover:scale-125',
                    LEVEL_CLASSES[day.level],
                )}
            />
        </Tooltip>
    );
}
