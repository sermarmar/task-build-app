import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardTitle } from "@/app/components/ux/Card";
import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { ColorPicker } from "@/app/components/ux/ColorPicker";
import { GroupService } from "@/app/core/service/groups/GroupService";
import type { Group } from "../models/Group";
import { EllipsisVertical } from "lucide-react";

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const GroupBoard: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [openGroupId, setOpenGroupId] = useState<string | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        GroupService.getAllGroups().then(({ groups, error }) => {
            if (error) return;
            setGroups(groups ?? []);
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setOpenGroupId(null);
            }
        };
        if (openGroupId) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openGroupId]);

    const handleColorChange = async (groupId: string, color: string) => {
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, color } : g));
        await GroupService.updateGroupColor(groupId, color);
    };

    return (
        <Card className="w-full">
            <CardTitle className="mb-5">Grupos</CardTitle>
            <CardBody>
                {groups.length === 0 ? (
                    <p>No hay grupos disponibles.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="p-4 rounded-md border-l-5 flex items-center justify-between"
                                style={{
                                    backgroundColor: hexToRgba(group.color, 0.1),
                                    borderColor: group.color,
                                }}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className="w-3 h-3 rounded-full inline-block"
                                            style={{ backgroundColor: group.color }}
                                        />
                                        <h3 className="font-semibold text-primary-950 capitalize">{group.name}</h3>
                                        <span className="ml-auto text-xs text-secondary-600">
                                            {group.categories?.length ?? 0} categorías
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {group.categories?.slice(0, 8).map((cat) => (
                                            <span
                                                key={cat.id}
                                                title={cat.name}
                                                className="w-7 h-7 flex items-center justify-center rounded-full text-white"
                                                style={{ backgroundColor: group.color }}
                                            >
                                                <DynamicIcon name={cat.icon} size={14} />
                                            </span>
                                        ))}
                                        {(group.categories?.length ?? 0) > 8 && (
                                            <span className="text-xs text-secondary-600 self-center">
                                                +{(group.categories?.length ?? 0) - 8}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="relative self-start">
                                    <button
                                        onClick={() => setOpenGroupId(openGroupId === group.id ? null : group.id)}
                                        className="p-1 rounded hover:bg-black/10 transition-colors cursor-pointer"
                                    >
                                        <EllipsisVertical size={16} />
                                    </button>

                                    {openGroupId === group.id && (
                                        <div
                                            ref={pickerRef}
                                            className="absolute right-0 top-8 z-50"
                                        >
                                            <ColorPicker
                                                value={group.color}
                                                onChange={(color) => handleColorChange(group.id, color)}
                                                showCopyButton={false}
                                                maxWidth={300}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};