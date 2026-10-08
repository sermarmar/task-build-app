import { cn } from "@/utils/cn";
import { DayActivity } from "../models/MapActivity";
import { LEVEL_CLASSES } from "@/app/shared/constants";

export const Legend: React.FC = () => {
    return (
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-primary-400 rounded-full bg-white/50 shadow-clay-inset px-3 py-1.5">
            <span>Menos</span>
            {([0, 1, 2, 3, 4] as DayActivity['level'][]).map((level) => (
                <div
                    key={level}
                    className={cn('size-3 rounded-[4px]', LEVEL_CLASSES[level])}
                />
            ))}
            <span>Más</span>
        </div>
    );
}
