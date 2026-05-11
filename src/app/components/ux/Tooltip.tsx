import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    content: React.ReactNode;
    placement?: Placement;
    arrow?: boolean;
    className?: string;
    children: React.ReactNode;
}

const GAP = 8;

const ARROW_CLASSES: Record<Placement, string> = {
    top:    'absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45',
    bottom: 'absolute -top-1 left-1/2 -translate-x-1/2 rotate-45',
    left:   'absolute -right-1 top-1/2 -translate-y-1/2 rotate-45',
    right:  'absolute -left-1 top-1/2 -translate-y-1/2 rotate-45',
};

function getPosition(rect: DOMRect, tooltipEl: HTMLDivElement, placement: Placement) {
    const { width: tw, height: th } = tooltipEl.getBoundingClientRect();
    const scroll = { x: window.scrollX, y: window.scrollY };

    switch (placement) {
        case 'top':
            return {
                top: rect.top + scroll.y - th - GAP,
                left: rect.left + scroll.x + rect.width / 2 - tw / 2,
            };
        case 'bottom':
            return {
                top: rect.bottom + scroll.y + GAP,
                left: rect.left + scroll.x + rect.width / 2 - tw / 2,
            };
        case 'left':
            return {
                top: rect.top + scroll.y + rect.height / 2 - th / 2,
                left: rect.left + scroll.x - tw - GAP,
            };
        case 'right':
            return {
                top: rect.top + scroll.y + rect.height / 2 - th / 2,
                left: rect.right + scroll.x + GAP,
            };
    }
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    placement = 'top',
    arrow = false,
    className,
    children,
}) => {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible && triggerRef.current && tooltipRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPos(getPosition(rect, tooltipRef.current, placement));
        }
    }, [visible, placement]);

    return (
        <>
            <div
                ref={triggerRef}
                className="relative inline-flex"
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            >
                {children}
            </div>

            {visible && createPortal(
                <div
                    ref={tooltipRef}
                    className="fixed z-9999 pointer-events-none"
                    style={pos ? { top: pos.top, left: pos.left } : { visibility: 'hidden' }}
                >
                    <div className="relative drop-shadow-md">
                        <div
                            className={cn(
                                'bg-white rounded-xl px-3 py-2 text-xs text-text-DEFAULT whitespace-nowrap',
                                'border border-primary-900/60',
                                className
                            )}
                        >
                            {content}
                        </div>

                        {arrow && (
                            <div
                                className={cn(
                                    ARROW_CLASSES[placement],
                                    'w-2 h-2 bg-white border border-primary-900/60'
                                )}
                            />
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
