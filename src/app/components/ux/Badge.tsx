

interface BadgeProps {
    color: string;
    text: string;
    onClick?: () => void;
}

const colorMap: Record<string, { bg: string; text: string }> = {
    'amber-200':   { bg: 'bg-amber-200',  text: 'text-black' },
    'yellow':   { bg: 'bg-yellow-400',  text: 'text-black' },
    'lime':     { bg: 'bg-lime-400',    text: 'text-black' },
    'amber':    { bg: 'bg-amber-400',   text: 'text-black' },
    'white':    { bg: 'bg-white',       text: 'text-black' },
    'gray-100': { bg: 'bg-gray-100',    text: 'text-black' },
    'gray-200': { bg: 'bg-gray-200',    text: 'text-black' },
    'sky-200':  { bg: 'bg-sky-200',     text: 'text-black' },
    'red':      { bg: 'bg-red-500',     text: 'text-white' },
    'blue':     { bg: 'bg-blue-500',    text: 'text-white' },
    'green':    { bg: 'bg-green-500',   text: 'text-white' },
    // Añade los colores que necesites...
};

export const Badge: React.FC<BadgeProps> = ({ color, text, onClick }) => {
    const { bg, text: textColor } = colorMap[color] ?? { bg: 'bg-gray-300', text: 'text-black' };

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${bg} ${textColor}`} onClick={onClick}>
            {text}
        </span>
    );
};