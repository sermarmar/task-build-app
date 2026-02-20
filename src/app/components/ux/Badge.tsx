

interface BadgeProps {
    color: string;
    text: string;
}

export const Badge: React.FC<BadgeProps> = ({ color, text }) => {
    const isLightColor = ['yellow', 'lime', 'amber', 'white', 'gray-100', 'gray-200', 'sky-300'].some(c => color.includes(c));
    const textColor = isLightColor ? 'text-black' : 'text-white';
    const classes = `px-2 py-1 rounded text-xs font-bold ${color} ${textColor}`; return (
        <span className={classes}>{ text }</span>
    );
}