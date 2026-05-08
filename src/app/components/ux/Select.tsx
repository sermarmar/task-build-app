import type { ReactElement } from "react";


interface InputProps<T> {
    name: string;
    label?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    className?: string;
    list: T[];
    showAll?: boolean;
    getOptionValue: (item: T) => string | number;
    getOptionLabel: (item: T) => string;
}

export const Select = <T,>({ name, label, value, onChange, required, className, list, showAll = false, getOptionValue, getOptionLabel }: InputProps<T>) => {
    
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
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition ${className || ''}`}
                required ={ required }
            >
                {showAll && <option value="">Todos</option>}
                {list.map((item: T, index: number) => (
                    <option key={index} value={getOptionValue(item)}>{getOptionLabel(item)}</option>
                ))}
            </select>
        </>
    );
}