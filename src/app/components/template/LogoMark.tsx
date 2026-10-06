import { Waves } from "lucide-react";
import { cn } from "@/utils/cn";

interface LogoMarkProps {
    size?: 'sm' | 'lg';
    className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ size = 'sm', className }) => (
    <span
        className={cn(
            "relative inline-flex items-center justify-center rounded-full clay-peach text-white shadow-clay-pressed shrink-0",
            size === 'sm' ? "size-12 [&_svg]:size-6" : "size-20 [&_svg]:size-10",
            className,
        )}
    >
        <span className="absolute -right-1 -bottom-1 size-1/2 rounded-full clay-blue shadow-clay-sm" />
        <Waves className="relative" strokeWidth={2.5} />
    </span>
);
