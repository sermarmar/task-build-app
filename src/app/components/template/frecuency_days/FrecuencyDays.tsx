import { useState } from 'react';
import FrecuencyData from './FrecuencyData.json';
import { Button } from '../../ux/Button';
import { CalendarRow } from '../../ux/CalendarRow';
import { cn } from '@/utils/cn';

type FrecuencyData = {
    label: string;
    value: string;
    options?: OptionsWeekly[];
}

type OptionsWeekly = {
    label: string;
    value: string;
}

interface FrecuencyDaysProps {
    onChange: (frequency: string, selectedOptions?: string[], selectedDays?: string[]) => void;
    initialFrequency?: string;
    initialOptions?: string[];
    initialDays?: string[];
}

export const FrecuencyDays: React.FC<FrecuencyDaysProps> = ({ onChange, initialFrequency = '', initialOptions = [], initialDays = [] }) => {
    const frequencyDays: FrecuencyData[] = FrecuencyData;
    const [selectedFrequency, setSelectedFrequency] = useState<string>(initialFrequency);
    const [selectedOption, setSelectedOption] = useState<OptionsWeekly[]>(
        initialFrequency === 'weekly'
            ? (FrecuencyData as FrecuencyData[]).find(f => f.value === 'weekly')?.options?.filter(o => initialOptions.includes(o.value)) ?? []
            : []
    );
    const [selectedDays, setSelectedDays] = useState<string[]>(initialFrequency === 'monthly' ? initialDays : []);

    const handleFrequencyChange = (value: string) => {
        setSelectedFrequency(value);
        setSelectedOption([] as OptionsWeekly[]); 
        setSelectedDays([]);
        onChange(value, [], []);
    }

    const handleSelectedDays = (option: OptionsWeekly) => {
        setSelectedOption(prev => {
            let newOptions;
            if (prev.some((o) => o.value === option.value)) {
                newOptions = prev.filter((o) => o.value !== option.value);
            } else {
                newOptions = [...prev, option];
            }
            onChange(selectedFrequency, newOptions.map((o) => o.value), selectedDays);
            return newOptions;
        });
    }

    const handleToggleDay = (day: string) => {
        setSelectedDays(prev => {
            const newDays = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
            onChange(selectedFrequency, selectedOption.map((o) => o.value), newDays);
            return newDays;
        });
    };

    return (
        <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex md:flex-col gap-2' role="radiogroup" aria-label="Frecuencia">
                {frequencyDays.map((frequency) => {
                    const active = selectedFrequency === frequency.value;
                    return (
                        <label
                            key={frequency.value}
                            className={cn(
                                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition-all whitespace-nowrap",
                                active ? "bg-surface text-primary-950 shadow-clay-sm" : "text-primary-500 hover:text-primary-800",
                            )}
                        >
                            <input
                                type="radio"
                                name="frequency"
                                value={frequency.value}
                                checked={active}
                                onChange={() => handleFrequencyChange(frequency.value)}
                                className="accent-tertiary-500"
                            />
                            {frequency.label}
                        </label>
                    );
                })}
            </div>
            {selectedFrequency === 'weekly' && (
                <div className="flex flex-wrap content-start gap-2">
                    {frequencyDays
                        .find((f) => f.value === selectedFrequency)
                        ?.options?.map((option) => (
                            <Button
                                key={option.value}
                                type='button'
                                form='rounded'
                                size='sm'
                                color={selectedOption.some((o) => o.value === option.value) ? 'tertiary' : 'light'}
                                onClick={() => handleSelectedDays(option)}
                            >
                                {option.label}
                            </Button>
                        ))
                    }
                </div>
            )}
            {selectedFrequency === 'monthly' && (
                <CalendarRow selectedDays={selectedDays} onToggleDay={handleToggleDay} />
            )}
        </div>
    );
};