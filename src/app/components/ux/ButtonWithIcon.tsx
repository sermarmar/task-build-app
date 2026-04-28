

interface ButtonWithIconProps {
    onClick: () => void;
    bgColor: string;
    buttonColor: string;
    buttonText: string;
    textColor: string;
    iconColor: string;
    icon: React.ReactNode;
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({ onClick, bgColor, buttonColor, buttonText, textColor, iconColor, icon }) => {
    
    return (
        <>
            <button 
            className={`w-full bg-${bgColor} flex items-center justify-between rounded-full p-2 pl-10`}
            onClick={onClick}>
                <span className={`text-lg text-${textColor} font-semibold`}>
                    {buttonText}
                </span>
                <span className={`bg-${buttonColor} text-${iconColor} rounded-full p-5 cursor-pointer`}>
                    {icon}
                </span>
            </button>
        </>
    );

}