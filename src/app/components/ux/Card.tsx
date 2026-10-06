import type React from "react";
import { cn } from "@/utils/cn";

interface CardProps {
    children?: React.ReactNode;
    className?: string;
    color?: string;
    withPadding?: boolean;
    tabTitle?: React.ReactNode;
    tabSubtitle?: React.ReactNode;
    tabActions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = "",
    color = "bg-surface",
    withPadding = true,
    tabTitle,
    tabSubtitle,
    tabActions,
}) => {
    if (tabTitle) {
        return (
            <section className={cn(color, "flex flex-col h-full rounded-3xl shadow-clay")}>
                <header className="flex items-center justify-between gap-3 px-6 pt-5 pb-3 shrink-0">
                    <div className="min-w-0">
                        <h2 className="font-heading text-lg font-bold text-primary-950 flex items-center gap-2.5 [&_svg]:size-5 [&_svg]:text-tertiary-500">
                            {tabTitle}
                        </h2>
                        {tabSubtitle && <p className="text-sm text-primary-500 mt-0.5">{tabSubtitle}</p>}
                    </div>
                    {tabActions && (
                        <div className="flex items-center gap-2 shrink-0">
                            {tabActions}
                        </div>
                    )}
                </header>
                <div className={cn("flex-1 min-h-0", withPadding && "px-6 pb-6", className)}>
                    {children}
                </div>
            </section>
        );
    }

    return (
        <div className={cn(color, "rounded-3xl shadow-clay", withPadding && "p-6", className)}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("border-b border-primary-100 pb-4", className)}>{children}</div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={className}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("border-t border-primary-100 pt-4 mt-4", className)}>{children}</div>
);

export const CardImage: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={cn("w-full h-auto rounded-t-3xl", className)} />
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={cn("font-heading text-xl font-bold text-primary-950", className)}>{children}</h2>
);

export const CardText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("text-primary-600 mt-2", className)}>{children}</div>
);
