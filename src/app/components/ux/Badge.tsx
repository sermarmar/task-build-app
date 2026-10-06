import { cn } from "@/utils/cn";

interface BadgeProps {
    color: string;
    text: string;
    onClick?: () => void;
    className?: string;
}

const colorMap: Record<string, string> = {
    'primary-900':  'bg-primary-900 text-tertiary-50',
    'amber-200':    'bg-amber-100 text-amber-800',
    'yellow':       'bg-cream-200 text-tertiary-900',
    'lime':         'bg-lime-100 text-lime-800',
    'amber':        'bg-amber-100 text-amber-800',
    'white':        'bg-white text-primary-800',
    'gray-100':     'bg-primary-50 text-primary-700',
    'gray-200':     'bg-primary-100 text-primary-700',
    'sky-200':      'bg-secondary-100 text-secondary-800',
    'red-400':      'bg-accent-blossom-200 text-accent-blossom-800',
    'blue':         'bg-secondary-200 text-secondary-900',
    'emerald-300':  'bg-emerald-100 text-emerald-800',
    'orange-300':   'bg-tertiary-100 text-tertiary-800',
    'stone-300':    'bg-stone-200 text-stone-700',
};

export const Badge: React.FC<BadgeProps> = ({ color, text, onClick, className }) => {
    // En Supabase el color es un nombre del mapa; en los mocks llega como hex
    const isHex = color.startsWith('#');

    return (
        <span
            className={cn(
                'inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold',
                !isHex && (colorMap[color] ?? 'bg-primary-100 text-primary-800'),
                onClick && 'cursor-pointer hover:brightness-95',
                className,
            )}
            style={isHex ? { backgroundColor: `${color}26`, color } : undefined}
            onClick={onClick}
        >
            {text}
        </span>
    );
};
