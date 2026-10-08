import { cn } from "@/utils/cn";

interface LogoMarkProps {
    size?: 'sm' | 'lg';
    className?: string;
}

// La imagen ya trae la insignia clay, la esfera azul y su sombra: el círculo ocupa ~3/4 del lado.
export const LogoMark: React.FC<LogoMarkProps> = ({ size = 'sm', className }) => (
    <img
        src="/logo-abyssal.webp"
        alt=""
        draggable={false}
        className={cn("shrink-0 select-none", size === 'sm' ? "size-16" : "size-28", className)}
    />
);
