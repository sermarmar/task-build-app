import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { toLocalDateString } from "../helpers/daysHelpers";
import { HabitCard } from "./HabitCard";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";

interface HabitsListProps {
    showButton?: boolean
}

const HabitCardSkeleton: React.FC = () => (
    <div className="rounded-xl border border-primary-100 p-4 flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
            <SkeletonLine className="w-1/2" />
            <SkeletonLine className="w-3/4 h-3" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
    </div>
);

export const HabitsList: React.FC<HabitsListProps> = ({showButton = true}) => {

    const { habits, habitLogs, error, isLoading, selectedDate } = useHabitBoardContext();

    const isHabitCompleted = (habitId: string): boolean => {
        const selectedDateStr = toLocalDateString(selectedDate);
        return habitLogs.some(log => log.habit_id === habitId && (log.completed_at as unknown as string) === selectedDateStr);
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 3 }).map((_, i) => <HabitCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <>
            {error && <div className="error">{error}</div>}
            {
                habits.length === 0 && !error &&
                <div className='text-tertiary-800 font-bold text-5xl text-center mt-5'>No hay hábitos disponibles</div>
            }
            <div className="grid grid-cols-1 gap-4">
                {habits
                .map(habit => (
                    <HabitCard key={habit.id!} habit={habit} isCompleted={isHabitCompleted(habit.id!)} showButton={showButton}/>
                ))}
            </div>
        </>
    );

}