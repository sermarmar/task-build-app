import type React from "react";

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            { children }
        </div>
    )
}

export const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={`border-b pb-4 mb-4 ${className}`}>
            { children }
        </div>
    )
}

export const CardBody: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={className}>
            { children }
        </div>
    )
}

export const CardFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={`border-t pt-4 mt-4 ${className}`}>
            { children }
        </div>
    )
}

export const CardImage: React.FC<{ src: string, alt?: string, className?: string }> = ({ src, alt, className }) => {
    return (
        <img src={src} alt={alt} className={`w-full h-auto rounded-t-lg ${className}`} />
    )
}

export const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>
            { children }
        </h2>
    )
}

export const CardText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={`text-gray-600 mt-2 ${className}`}>
            { children }
        </div>
    )
}