import { cn } from "@/utils/cn";

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
    return (
        <>
            {label && (
                <label htmlFor={name} className="block text-sm font-bold text-primary-800 mb-2">
                    { label }
                </label>
            )}
            <select
                id={name}
                value={ value }
                name={ name }
                onChange={ onChange }
                className={cn(
                    'w-full px-4 py-3 rounded-2xl bg-white/70 border border-white shadow-clay-inset text-primary-950',
                    'focus:ring-2 focus:ring-tertiary-300 focus:bg-white outline-none transition cursor-pointer',
                    className,
                )}
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
