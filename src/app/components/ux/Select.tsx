import type { ReactElement } from "react";

interface InputProps {
    name: string;
    label?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    className?: string;
    list: string[];
}

export const Select: React.FC<InputProps> = ({ name, label, value, onChange, required, className, list }) => {
    
    let labelElement: ReactElement = <></>;

    if(label) {
        labelElement = <label className="block text-sm font-medium text-gray-700 mb-2">
            { label }
        </label>
    }
    
    return (
        <>
            {labelElement}
            <select
                value={ value }
                name={ name }
                onChange={ onChange }
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${className || ''}`}
                required ={ required }
            >
                {
                    list.map((item, index) => <option key={index} value={item}>{item}</option>)
                }
            </select>
        </>
    );
}