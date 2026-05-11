import { twMerge } from "tailwind-merge";

export type ButtonSize = 'sm' | 'md' | 'lg';

const formSizeClasses: Record<ButtonSize, Record<'square' | 'rounded' | 'pill', string>> = {
    sm: { square: 'rounded-md px-3 py-1.5', rounded: 'rounded-lg px-3 py-1.5', pill: 'rounded-full p-1.5' },
    md: { square: 'rounded-md px-4 py-2',   rounded: 'rounded-lg px-4 py-2',   pill: 'rounded-full p-2'   },
    lg: { square: 'rounded-md px-5 py-2.5', rounded: 'rounded-lg px-5 py-2.5', pill: 'rounded-full p-3'   },
};

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type: 'button' | 'submit' | 'reset';
    form?: 'square' | 'rounded' | 'pill';
    size?: ButtonSize;
    disabled?: boolean;
    color?: 'primary' | 'secondary' | 'tertiary' | 'transparent' | 'danger' | 'warning' | 'success' | 'info' | 'light' | 'dark';
    style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className, type, form = 'square', size = 'md', disabled, color = 'primary', style }) => {

    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'bg-primary-900 text-tertiary-50';
            case 'secondary':
                return 'bg-secondary-500 text-tertiary-50';
            case 'tertiary':
                return 'bg-tertiary-500 text-tertiary-50';
            case 'transparent':
                return 'bg-transparent text-primary-900';
        }
    }

    const getFormClass = () => formSizeClasses[size][form ?? 'square'];

    return (
        <button 
            type={type} 
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={twMerge( getColorClass(), 'flex items-center gap-2 cursor-pointer', getFormClass(), 'font-semibold transform hover:scale-105 transition duration-200', className )}>
            { children }
        </button>
    )
}