import type { ReactElement } from "react";

interface InputProps {
    name: string;
    label?: string;
    type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'range' | 'textarea';
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

export const Input: React.FC<InputProps> = ({ name, label, type, value, onChange, placeholder, required }) => {
    
    let labelElement: ReactElement = <></>;

    if(label) {
        labelElement = <label className="block text-sm font-medium text-gray-700 mb-2">
            { label }
        </label>
    }
    
    return (
        <>
            {labelElement}
            <input
                type={ type }
                value={ value }
                name={ name }
                onChange={ onChange }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder={ placeholder }
                required ={ required }
            />
        </>
    );
}