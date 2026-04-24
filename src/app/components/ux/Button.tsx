import { twMerge } from "tailwind-merge";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type: 'button' | 'submit' | 'reset';
    form?: 'square' | 'rounded' | 'pill';
    disabled?: boolean;
    color?: 'primary' | 'secondary' | 'tertiary' | 'transparent' | 'danger' | 'warning' | 'success' | 'info' | 'light' | 'dark';
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className, type, form = 'square', disabled, color = 'primary' }) => {

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

    const getFormClass = () => {
        switch (form) {
            case 'square':
                return 'rounded-md px-4 py-2';
            case 'rounded':
                return 'rounded-lg px-4 py-2';
            case 'pill':
                return 'rounded-full p-2';
        }
    }

    return (
        <button 
            type={type} 
            onClick={onClick}
            disabled={disabled}
            className={twMerge( getColorClass(), 'flex items-center gap-2 cursor-pointer', getFormClass(), 'font-semibold transform hover:scale-105 transition duration-200', className )}>
            { children }
        </button>
    )
}