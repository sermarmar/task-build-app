import { cn } from "@sglara/cn";
import { DayActivity } from "../models/MapActivity";
import { LEVEL_CLASSES } from "@/app/shared/constants";



export const Legend: React.FC = () => {
    return (
        <div className="flex items-center gap-1.5 text-[10px] text-text-DEFAULT/50">
            <span>Menos</span>
            {([0, 1, 2, 3, 4] as DayActivity['level'][]).map((level) => (
                <div
                    key={level}
                    className={cn('w-3 h-3 rounded-sm', LEVEL_CLASSES[level])}
                />
            ))}
            <span>Más</span>
        </div>
    );
}