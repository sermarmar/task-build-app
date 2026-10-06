import { twMerge } from "tailwind-merge";

interface CalendarRowProps {
    selectedDays: string[];
    onToggleDay: (day: string) => void;
}

export const CalendarRow: React.FC<CalendarRowProps> = ({ selectedDays, onToggleDay }) => {
    return (
        <div className="grid grid-cols-7 gap-2">
            {
                Array.from({length: 31}, (_, i) => {
                    const day = (i + 1).toString();
                    const isSelected = selectedDays.includes(day);

                    return (
                        <div
                            key={i}
                            className={twMerge(
                                "rounded-full size-10 flex items-center justify-center cursor-pointer text-sm font-bold transition-all",
                                isSelected ? "clay-peach text-white shadow-clay-pressed" : "bg-surface text-primary-600 shadow-clay-sm hover:text-primary-900"
                            )}
                            onClick={() => onToggleDay(day)}
                        >
                            {i + 1}
                        </div>
                    );
                })
            }
        </div>
    );
};