import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Status } from "../../../core/models/Status";
import { Badge } from '../../ux/Badge';
import { StatusService } from "../../../core/service/status/StatusService";
import { cn } from "@/utils/cn";

interface BadgeStatusDynamicProps {
    status?: Status;
    showAll?: boolean;
    onChange: (status: Status | null) => void;
}

export const BadgeStatusDynamic: React.FC<BadgeStatusDynamicProps> = ({ status, showAll = false, onChange }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        StatusService.getAllStatus().then((response) => {
            setStatuses(response.status || []);
        });
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (selected: Status) => {
        onChange(selected);
        setIsOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="flex items-center gap-2 rounded-full bg-surface shadow-clay-sm pl-1.5 pr-3 py-1.5 cursor-pointer"
            >
                {status
                    ? <Badge color={status.color} text={status.name} />
                    : <Badge color="primary-900" text="Todos los estados" />
                }
                <ChevronDown size={16} className={cn("text-primary-500 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 z-50 flex flex-wrap gap-2 w-64 rounded-2xl bg-surface shadow-clay p-3">
                    {showAll && (
                        <Badge color="primary-900" text="Todos" onClick={() => { onChange(null); setIsOpen(false); }} />
                    )}
                    {statuses.map((s) => (
                        <Badge key={s.id} color={s.color} text={s.name} onClick={() => handleSelect(s)} />
                    ))}
                </div>
            )}
        </div>
    );
}
