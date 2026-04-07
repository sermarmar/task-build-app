import { useState } from "react";
import { twMerge } from "tailwind-merge";


export const Calendar: React.FC = () => {

    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const toggleDay = (day: string) => {
        setSelectedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }

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
                                isSelected ? "bg-gradient-to-r from-accent-from to-accent-to text-white font-bold" : "bg-gray-200"
                            )}
                            onClick={() => toggleDay(day)}
                        >
                            {i + 1}
                        </div>
                    );
                })
            }
        </div>
    );
};