import type React from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export interface TabItem {
    label: React.ReactNode;
    content: React.ReactNode;
    actions?: React.ReactNode;
}

interface CardProps {
    children?: React.ReactNode;
    className?: string;
    color?: string;
    withPadding?: boolean;
    tabOuterBg?: string;
    // Single tab (legacy)
    tabTitle?: React.ReactNode;
    tabActions?: React.ReactNode;
    // Multiple tabs
    tabs?: TabItem[];
    defaultTab?: number;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = "",
    color = "bg-white",
    withPadding = true,
    tabOuterBg = '#eceee6',
    tabTitle,
    tabActions,
    tabs,
    defaultTab = 0,
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const paddingClass = withPadding ? "p-6" : "";

    if (tabs && tabs.length > 0) {
        const current = tabs[activeTab] ?? tabs[0];
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-end w-full">
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={twMerge(
                                color,
                                "relative px-6 py-2 rounded-t-2xl text-xl font-semibold shrink-0 transition-opacity",
                                i === activeTab ? "z-10 opacity-100" : "opacity-50 hover:opacity-70 z-0"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div
                        className="w-6 h-6 shrink-0 z-0"
                        style={{
                            background: tabOuterBg,
                            borderBottomLeftRadius: '100%',
                            boxShadow: `-5px 5px 0 0 white`,
                        }}
                    />
                    {current.actions && (
                        <div className="ml-auto flex items-center gap-2 pb-2 pr-5">
                            {current.actions}
                        </div>
                    )}
                </div>
                <div className={twMerge(color, "rounded-tr-3xl rounded-b-3xl flex-1 min-h-0", paddingClass, className)}>
                    {current.content}
                </div>
            </div>
        );
    }

    if (tabTitle) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-end w-full">
                    <div className={twMerge(color, "relative px-6 py-2 rounded-t-2xl text-xl font-semibold flex-shrink-0 z-10")}>
                        {tabTitle}
                    </div>
                    <div
                        className="w-6 h-6 shrink-0 z-0"
                        style={{
                            background: tabOuterBg,
                            borderBottomLeftRadius: '100%',
                            boxShadow: `-5px 5px 0 0 white`,
                        }}
                    />
                    {tabActions && (
                        <div className="ml-auto flex items-center gap-2 pb-2 pr-5">
                            {tabActions}
                        </div>
                    )}
                </div>
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