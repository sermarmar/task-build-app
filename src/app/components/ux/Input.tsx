import { forwardRef, type ReactElement } from "react";
import { twMerge } from "tailwind-merge";

type InputSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
};

interface InputProps {
    name: string;
    label?: string;
    type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'range' | 'textarea';
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    size?: InputSize;
    className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ name, label, type, value, onChange, placeholder, required, size = 'md', className }, ref) => {
    
    let labelElement: ReactElement = <></>;

    if (label) {
        labelElement = (
            <label className="block text-sm font-medium text-primary-950 mb-2">
                {label}
            </label>
        );
    }
    
    return (
        <>
            {labelElement}
            <input
                ref={ref}
                type={type}
                value={value}
                name={name}
                onChange={onChange}
                className={twMerge('w-full rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition', sizeClasses[size], className)}
                placeholder={placeholder}
                required={required}
            />
        </>
    );
});

Input.displayName = 'Input';