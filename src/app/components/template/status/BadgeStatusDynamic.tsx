import { useEffect, useRef, useState } from "react";
import type { Status } from "../../../core/models/Status";
import { Badge } from '../../ux/Badge';
import { StatusService } from "../../../core/service/status/StatusService";

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
        <div ref={ref} className="cursor-default">
            <div onClick={() => setIsOpen(!isOpen)}>
                {status
                    ? <Badge color={status.color} text={status.name} />
                    : <Badge color="primary-900" text="Todos" />
                }
            </div>
            {isOpen && (
                <div className="absolute bg-white border border-gray-300 rounded shadow p-2 mt-1 grid gap-1 grid-cols-3 z-50">
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