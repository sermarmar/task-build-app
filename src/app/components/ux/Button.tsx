interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'light' | 'dark';
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className, type, disabled, color = 'primary' }) => {

    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'bg-gradient-to-r from-accent-from to-accent-to';
            case 'secondary':
                return 'bg-gray-500';
        }
    }

    return (
        <button 
            type={type} 
            onClick={onClick}
            disabled={disabled}
            className={`w-full ${ getColorClass() } text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition duration-200 shadow-lg ${className}`}>
            { children }
        </button>
    )
}