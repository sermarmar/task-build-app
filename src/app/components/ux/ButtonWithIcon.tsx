import { twMerge } from "tailwind-merge";


interface ButtonWithIconProps {
    onClick: () => void;
    bgColor: string;
    buttonColor: string;
    buttonText: string;
    textColor: string;
    iconColor: string;
    icon: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({ onClick, bgColor, buttonColor, buttonText, textColor, iconColor, icon, size = 'medium' }) => {

    const sizeClasses = size === 'small' ? 'p-1 pl-4' : size === 'large' ? 'p-4 pl-12' : 'p-3 pl-10';
    const textSizeClasses = size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base';
    const iconSizeClasses = size === 'small' ? 'p-3' : size === 'large' ? 'p-5' : 'p-4';
    
    return (
        <button
            className={twMerge('w-full flex items-center justify-between rounded-full', bgColor, sizeClasses)}
            onClick={onClick}
        >
            <span className={twMerge(textSizeClasses, textColor, 'font-semibold')}>
                {buttonText}
            </span>
            <span className={twMerge('rounded-full cursor-pointer', buttonColor, iconColor, iconSizeClasses)}>
                {icon}
            </span>
        </button>
    );

}