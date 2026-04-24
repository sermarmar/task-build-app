import React, { useState } from 'react';
import FrecuencyData from './FrecuencyData.json';
import { Button } from '../../ux/Button';
import { Calendar } from '../../ux/CalendarRow';

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
}

export const FrecuencyDays: React.FC<FrecuencyDaysProps> = ({ onChange }) => {
    const frequencyDays: FrecuencyData[] = FrecuencyData;
    const [selectedFrequency, setSelectedFrequency] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<OptionsWeekly[]>([] as OptionsWeekly[]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

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
        <div className='flex'>
            <div className='flex flex-col gap-2'>
                {frequencyDays.map((frequency) => (
                    <div key={frequency.value}>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="frequency"
                                value={frequency.value}
                                checked={selectedFrequency === frequency.value}
                                onChange={() => handleFrequencyChange(frequency.value)}
                            />
                            {frequency.label}
                        </label>
                    </div>
                ))}
            </div>
            {selectedFrequency === 'weekly' && (
                <div className="ml-4 grid grid-cols-4 justify-items-center-self gap-y-2 gap-x-4">
                    {frequencyDays
                        .find((f) => f.value === selectedFrequency)
                        ?.options?.map((option) => (
                            <React.Fragment key={option.value}>
                                <Button
                                    type='button'
                                    color={selectedOption.some((o) => o.value === option.value) ? 'primary' : 'secondary'}
                                    onClick={() => handleSelectedDays(option)}
                                >
                                    {option.label}
                                </Button>
                            </React.Fragment>
                            
                        ))
                    }
                </div>
            )}
            {selectedFrequency === 'monthly' && (
                <Calendar selectedDays={selectedDays} onToggleDay={handleToggleDay} />
            )}
        </div>
    );
};