import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ show, onClose, title, subtitle, children, className }) => {
    const [visible, setVisible] = useState(show);

    if (show && !visible) {
        setVisible(true);
    }

    // Se mantiene montado 300ms tras cerrar para que se vea la animación de salida
    useEffect(() => {
        if (show) return;
        const t = setTimeout(() => setVisible(false), 300);
        return () => clearTimeout(t);
    }, [show]);

    useEffect(() => {
        if (!show) return;
        const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [show, onClose]);

    if (!visible) return null;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/25 backdrop-blur-sm transition-opacity duration-300",
                show ? "opacity-100" : "opacity-0",
            )}
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "relative w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-primary rounded-[2rem] bg-surface shadow-clay p-6 md:p-8",
                    "transition-all duration-300",
                    show ? "scale-100 opacity-100" : "scale-95 opacity-0",
                    className,
                )}
            >
                <header className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="font-heading text-2xl font-bold text-primary-950">{title}</h2>
                        {subtitle && <p className="text-sm text-primary-500 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        type="button"
                        aria-label="Cerrar"
                        onClick={onClose}
                        className="size-10 shrink-0 rounded-full clay-knob flex items-center justify-center text-primary-700 hover:text-tertiary-600 transition cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </header>
                {children}
            </div>
        </div>,
        document.body
    );
};
