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
    placeholder?: string;
    required?: boolean;
    size?: InputSize;
    className?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ name, label, type, value, onChange, placeholder, required, size = 'md', className, icon }, ref) => {
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
                    className={cn(
                        'w-full rounded-2xl bg-white/70 border border-white shadow-clay-inset text-primary-950 placeholder:text-primary-400',
                        'focus:ring-2 focus:ring-tertiary-300 focus:bg-white outline-none transition',
                        sizeClasses[size],
                        !!icon && 'pl-10',
                        className,
                    )}
                    placeholder={placeholder}
                    required={required}
                />
            </div>
        </>
    );
});

Input.displayName = 'Input';
