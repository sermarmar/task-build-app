import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { toLocalDateString } from "../helpers/daysHelpers";
import { HabitCard } from "./HabitCard";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import { cn } from "@/utils/cn";

interface HabitsListProps {
    showButton?: boolean;
    className?: string;
}

const HabitCardSkeleton: React.FC = () => (
    <div className="rounded-2xl bg-white/50 p-3 flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
            <SkeletonLine className="w-1/2" />
            <SkeletonLine className="w-1/3 h-3" />
        </div>
        <Skeleton className="size-6 rounded-md shrink-0" />
    </div>
);

export const HabitsList: React.FC<HabitsListProps> = ({ showButton = true, className }) => {

    const { habits, habitLogs, error, isLoading, selectedDate } = useHabitBoardContext();

    const isHabitCompleted = (habitId: string): boolean => {
        const selectedDateStr = toLocalDateString(selectedDate);
        return habitLogs.some(log => log.habit_id === habitId && (log.completed_at as unknown as string) === selectedDateStr);
    }

    if (isLoading) {
        return (
            <div className={cn("grid grid-cols-1 gap-3 p-1", className)}>
                {Array.from({ length: 3 }).map((_, i) => <HabitCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <>
            {error && <p className="text-sm text-accent-blossom-700">{error}</p>}
            {habits.length === 0 && !error && (
                <p className="text-primary-400 font-bold text-center py-10">No hay hábitos para este día</p>
            )}
            <div className={cn("grid grid-cols-1 gap-3 p-1", className)}>
                {habits.map(habit => (
                    <HabitCard key={habit.id!} habit={habit} isCompleted={isHabitCompleted(habit.id!)} showButton={showButton}/>
                ))}
            </div>
        </>
    );

}
