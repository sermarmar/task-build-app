import { forwardRef } from "react";
import { cn } from "@/utils/cn";

type InputSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<InputSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
};

interface InputProps {
    name: string;
    label?: string;
    type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'range' | 'textarea';
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    size?: InputSize;
    className?: string;
    icon?: React.ReactNode;
    suffix?: string;
    min?: number | string;
    max?: number | string;
    step?: number | string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ name, label, type, value, onChange, onBlur, placeholder, required, size = 'md', className, icon, suffix, min, max, step }, ref) => {
    return (
        <>
            {label && (
                <label htmlFor={name} className="block text-sm font-bold text-primary-800 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none [&_svg]:size-4">
                        {icon}
                    </span>
                )}
                <input
                    ref={ref}
                    id={name}
                    type={type}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    min={min}
                    max={max}
                    step={step}
                    className={cn(
                        'w-full rounded-2xl bg-white/70 border border-white shadow-clay-inset text-primary-950 placeholder:text-primary-400',
                        'focus:ring-2 focus:ring-tertiary-300 focus:bg-white outline-none transition',
                        sizeClasses[size],
                        !!icon && 'pl-10',
                        !!suffix && 'pr-12',
                        className,
                    )}
                    placeholder={placeholder}
                    required={required}
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-primary-400 pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
        </>
    );
});

Input.displayName = 'Input';
