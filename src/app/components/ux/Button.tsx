import { cn } from "@/utils/cn";

export type ButtonSize = 'sm' | 'md' | 'lg';

const formSizeClasses: Record<ButtonSize, Record<'square' | 'rounded' | 'pill', string>> = {
    sm: { square: 'rounded-xl px-3 py-1.5 text-sm', rounded: 'rounded-full px-4 py-1.5 text-sm', pill: 'rounded-full p-1.5' },
    md: { square: 'rounded-2xl px-4 py-2',          rounded: 'rounded-full px-5 py-2',          pill: 'rounded-full p-2'   },
    lg: { square: 'rounded-2xl px-5 py-2.5',        rounded: 'rounded-full px-6 py-2.5',        pill: 'rounded-full p-3'   },
};

const colorClasses = {
    primary:     'bg-primary-900 text-tertiary-50 shadow-clay-pressed',
    secondary:   'clay-blue text-secondary-950 shadow-clay-pressed',
    tertiary:    'clay-peach text-white shadow-clay-pressed',
    transparent: 'bg-transparent text-primary-900',
    light:       'bg-surface text-primary-800 shadow-clay-sm',
    danger:      'bg-accent-blossom-300 text-accent-blossom-900 shadow-clay-pressed',
    warning:     'bg-cream-300 text-tertiary-900 shadow-clay-pressed',
    success:     'bg-emerald-200 text-emerald-900 shadow-clay-pressed',
    info:        'bg-secondary-200 text-secondary-900 shadow-clay-pressed',
    dark:        'bg-primary-950 text-tertiary-50 shadow-clay-pressed',
};

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type: 'button' | 'submit' | 'reset';
    form?: 'square' | 'rounded' | 'pill';
    size?: ButtonSize;
    disabled?: boolean;
    color?: keyof typeof colorClasses;
    style?: React.CSSProperties;
    ariaLabel?: string;
    title?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className, type, form = 'square', size = 'md', disabled, color = 'primary', style, ariaLabel, title }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            aria-label={ariaLabel}
            title={title}
            className={cn(
                colorClasses[color],
                'flex items-center gap-2 cursor-pointer font-bold',
                formSizeClasses[size][form],
                'transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none',
                className,
            )}>
            { children }
        </button>
    )
}
