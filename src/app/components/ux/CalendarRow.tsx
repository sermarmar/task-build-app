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
                                "p-3 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer",
                                isSelected ? "bg-secondary-500 text-white font-bold" : "bg-tertiary-300"
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