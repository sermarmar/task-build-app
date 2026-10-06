import { cn } from "@/utils/cn";

interface CircularProgressProps {
    text?: React.ReactNode;
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
    className?: string;
    textClassName?: string;
    knob?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    text,
    value = 0,
    size = 120,
    strokeWidth = 10,
    color = "var(--color-tertiary-400)",
    trackColor = "var(--color-primary-100)",
    className,
    textClassName,
    knob = false,
}) => {

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.min(100, Math.max(0, value));
    const offset = circumference - (clamped / 100) * circumference;
    const knobInset = strokeWidth + 6;

    return (
        <div className={cn("relative inline-flex items-center justify-center shrink-0", className)} style={{ width: size, height: size }}>
            {knob && (
                <span className="absolute rounded-full clay-knob" style={{ inset: knobInset }} />
            )}
            <svg width={size} height={size} className="-rotate-90 absolute inset-0">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
            </svg>
            <span className={cn("relative font-heading text-4xl font-bold text-primary-950", textClassName)}>
                {text ?? `${clamped}%`}
            </span>
        </div>
    );

}
