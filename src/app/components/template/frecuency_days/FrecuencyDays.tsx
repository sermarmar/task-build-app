import React, { useState } from 'react';
import FrecuencyData from './FrecuencyData.json';
import { Button } from '../../ux/Button';
import { Calendar } from '../../ux/Calendar';

type FrecuencyData = {
    label: string;
    value: string;
    options?: OptionsWeekly[];
}

type OptionsWeekly = {
    label: string;
    value: string;
}

export const FrecuencyDays: React.FC = () => {
    const frequencyDays: FrecuencyData[] = FrecuencyData;
    const [selectedFrequency, setSelectedFrequency] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<OptionsWeekly>({} as OptionsWeekly);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const handleFrequencyChange = (value: string) => {
        setSelectedFrequency(value);
        setSelectedOption({} as OptionsWeekly); // Resetear la opción seleccionada al cambiar la frecuencia
    }

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
                                    color={selectedOption.value === option.value ? 'primary' : 'secondary'}
                                    onClick={() => setSelectedOption(option)}
                                >
                                    {option.label}
                                </Button>
                            </React.Fragment>
                            
                        ))
                    }
                </div>
            )}
            {selectedFrequency === 'monthly' && (
                <Calendar />
            )}
        </div>
    );
};