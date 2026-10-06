import { cn } from "@/utils/cn";

interface HabitDateProps {
    day: string;
    numDay: number
    isActive: boolean;
    isToday?: boolean;
    onClick: () => void;
}

export const HabitDate: React.FC<HabitDateProps> = ({ day, numDay, isActive, isToday, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isActive}
            className={cn(
                "flex flex-col items-center gap-1.5 w-14 shrink-0 rounded-full pt-2.5 pb-1.5 font-bold cursor-pointer transition-all",
                isActive
                    ? "clay-peach text-white shadow-clay-pressed"
                    : isToday
                        ? "bg-surface text-tertiary-600 shadow-clay-sm"
                        : "text-primary-500 hover:bg-white/70",
            )}
        >
            <span className="text-xs">{day}</span>
            <span className={cn(
                "size-10 rounded-full flex items-center justify-center text-base",
                isActive ? "clay-knob text-tertiary-600" : "bg-white/60",
            )}>
                {numDay}
            </span>
        </button>
    )
}
