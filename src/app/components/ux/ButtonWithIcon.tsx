import { cn } from "@/utils/cn";

interface ButtonWithIconProps {
    onClick: () => void;
    bgColor: string;
    buttonColor: string;
    buttonText: string;
    textColor: string;
    iconColor: string;
    icon: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({ onClick, bgColor, buttonColor, buttonText, textColor, iconColor, icon, size = 'medium', className }) => {

    const sizeClasses = size === 'small' ? 'p-1 pl-4 gap-3' : size === 'large' ? 'p-2 pl-6 gap-5' : 'p-1.5 pl-5 gap-4';
    const textSizeClasses = size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base';
    const iconSizeClasses = size === 'small' ? 'size-8 [&_svg]:size-4' : size === 'large' ? 'size-12' : 'size-10 [&_svg]:size-5';

    return (
        <button
            type="button"
            className={cn(
                'flex items-center justify-between rounded-full cursor-pointer shadow-clay-sm',
                'transition duration-200 hover:-translate-y-0.5 active:translate-y-0',
                bgColor, sizeClasses, className,
            )}
            onClick={onClick}
        >
            <span className={cn(textSizeClasses, textColor, 'font-bold whitespace-nowrap')}>
                {buttonText}
            </span>
            <span className={cn('rounded-full flex items-center justify-center shrink-0', buttonColor, iconColor, iconSizeClasses)}>
                {icon}
            </span>
        </button>
    );
}
