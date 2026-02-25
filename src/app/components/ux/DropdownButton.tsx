import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownButtonProps {
    children?: React.ReactNode;
    buttonText: string;
    list: { label: React.ReactNode; onClick: () => void }[];
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({ children, buttonText, list }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="bg-gradient-to-r from-accent-from to-accent-to flex items-center gap-2 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition duration-200 shadow-lg"
            >
                {children}
                <span>{buttonText}</span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                    {list.map((item, index) => (
                        <li key={index}>
                            <button
                                type="button"
                                onClick={() => { item.onClick(); setOpen(false); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}