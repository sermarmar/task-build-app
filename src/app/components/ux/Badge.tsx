

interface BadgeProps {
    color: string;
    text: string;
    onClick?: () => void;
}

const colorMap: Record<string, { bg: string; text: string }> = {
    'amber-200':    { bg: 'bg-amber-200',   text: 'text-amber-700' },
    'yellow':       { bg: 'bg-yellow-400',  text: 'text-black' },
    'lime':         { bg: 'bg-lime-400',    text: 'text-black' },
    'amber':        { bg: 'bg-amber-400',   text: 'text-black' },
    'white':        { bg: 'bg-white',       text: 'text-black' },
    'gray-100':     { bg: 'bg-gray-100',    text: 'text-black' },
    'gray-200':     { bg: 'bg-gray-200',    text: 'text-black' },
    'sky-200':      { bg: 'bg-sky-200',     text: 'text-sky-700' },
    'red-400':      { bg: 'bg-red-400',     text: 'text-red-900' },
    'blue':         { bg: 'bg-blue-500',    text: 'text-white' },
    'emerald-300':  { bg: 'bg-emerald-300', text: 'text-emerald-800' },
    'orange-300':   { bg: 'bg-orange-300',  text: 'text-orange-800'},
    'stone-300':    { bg: 'bg-stone-300',   text: 'text-stone-800'}
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