import { twMerge } from "tailwind-merge";
import { useScrollFade } from "@/app/hooks/useScrollFade";

interface ScrollFadeContainerProps {
    children: React.ReactNode;
    className?: string;
    fadeColor?: string;
    fadeSize?: string;
    duration?: string;
}

export const ScrollFadeContainer: React.FC<ScrollFadeContainerProps> = ({
    children,
    className,
    fadeColor = 'white',
    fadeSize = 'h-10',
    duration = 'duration-300',
}) => {
    const { ref, onScroll, atTop, atBottom } = useScrollFade();

    const overlay = (side: 'top' | 'bottom', hidden: boolean) => (
        <div
            className={twMerge(
                'absolute inset-x-0 pointer-events-none z-10 transition-opacity',
                fadeSize,
                duration,
                side === 'top' ? 'top-0' : 'bottom-0',
                hidden ? 'opacity-0' : 'opacity-100',
            )}
            style={{
                background: `linear-gradient(to ${side === 'top' ? 'bottom' : 'top'}, ${fadeColor}, transparent)`,
            }}
        />
    );

    return (
        <div className={twMerge('relative', className)}>
            {overlay('top', atTop)}
            <div ref={ref} onScroll={onScroll} className="h-full overflow-y-auto">
                {children}
            </div>
            {overlay('bottom', atBottom)}
        </div>
    );
};
