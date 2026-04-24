import { useState } from "react";

export const Calendar = () => {

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];


    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-lg font-medium text-center mb-5">
                    {`${new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).slice(1)}`}
                </h2>
                <div className="grid grid-cols-7 gap-1 w-full">
                    {days.map((day) => (
                        <div key={day} className="text-center text-sm font-medium flex items-center justify-center text-tertiary-50">
                            {day}
                        </div>
                    ))}
                    {
                        Array.from({ length: (new Date(currentYear, currentMonth, 1).getDay() || 7) - 1 }, (_, i) => (
                            <div key={`empty-${i}`} className="text-center text-sm" />
                        ))
                    }
                    {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => (
                        <div
                            key={i}
                            className={`flex items-center justify-center text-sm relative `}
                        >
                            <span className={`flex items-center justify-center w-10 h-10 ${new Date(currentYear, currentMonth, i + 1).toDateString() === today.toDateString() ? 'bg-secondary-600 text-tertiary-50' : 'hover:bg-secondary-200 cursor-pointer'} rounded-full` }>
                               {i + 1} 
                            </span>
                            
                        </div>
                    ))
                    }
                </div>
            </div>
        </>
    );
}