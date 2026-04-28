interface CircularProgressProps {
    text?: string;
    value: number; // Expected to be between 0 and 100
    size?: number; // Diameter of the circular progress in pixels
    strokeWidth?: number; // Thickness of the progress stroke
    color?: string; 
}


export const CircularProgress: React.FC<CircularProgressProps> = ({ text, value = 0, size = 120, strokeWidth = 10, color = "var(--color-primary-900)" }) => {

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
 
    return (
        <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
            {/* Track (fondo) */}
            <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            />
            {/* Progress */}
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
        {/* Texto central */}
        <span className="absolute text-4xl font-bold text-primary-950">
            {text || `${value}%`}
        </span>
        </div>
    );

}