import type React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
    withPadding?: boolean;
    tabTitle?: React.ReactNode;
    tabOuterBg?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = "",
    color = "bg-white",
    withPadding = true,
    tabTitle,
    tabOuterBg = '#F3F4EF'
}) => {
    const paddingClass = withPadding ? "p-6" : "";

    if (tabTitle) {
        return (
            <div className="flex flex-col h-full">
                {/* Fila del tab + esquina cóncava como elementos hermanos en flex */}
                <div className="flex items-end">
                    {/* Tab */}
                    <div className={twMerge(color, "relative px-6 py-2 rounded-t-2xl text-xl font-semibold flex-shrink-0 z-10")}>
                        {tabTitle}
                    </div>
                    {/* Esquina cóncava — hermano del tab, alineado al fondo */}
                    <div
                        className="w-6 h-6 flex-shrink-0 z-0"
                        style={{
                            background: tabOuterBg,
                            borderBottomLeftRadius: '100%',
                            boxShadow: `-5px 5px 0 0 white`,
                        }}
                    />
                </div>
                {/* Card body — sin rounded arriba-izquierda */}
                <div className={twMerge(color, "rounded-tr-3xl rounded-b-3xl flex-1 min-h-0", paddingClass, className)}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className={twMerge(color, 'rounded-3xl shadow', paddingClass, className)}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`border-b pb-4 ${className}`}>{children}</div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={className}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`border-t pt-4 mt-4 ${className}`}>{children}</div>
);

export const CardImage: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={`w-full h-auto rounded-t-lg ${className}`} />
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={twMerge('text-2xl font-bold text-gray-800', className)}>{children}</h2>
);

export const CardText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={twMerge('text-gray-600 mt-2', className)}>{children}</div>
);