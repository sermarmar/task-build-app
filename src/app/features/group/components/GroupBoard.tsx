import { useEffect, useRef, useState } from "react";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import { Card } from "@/app/components/ux/Card";
import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { ColorPicker } from "@/app/components/template/ColorPicker";
import { GroupService } from "@/app/core/service/groups/GroupService";
import type { Group } from "../models/Group";
import { Layers, Palette } from "lucide-react";

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const GroupCardSkeleton: React.FC = () => (
    <div className="rounded-3xl bg-white/50 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <SkeletonLine className="w-1/3" />
        </div>
        <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="size-8 rounded-xl" />
            ))}
        </div>
    </div>
);

export const GroupBoard: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openGroupId, setOpenGroupId] = useState<string | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        GroupService.getAllGroups().then(({ groups, error }) => {
            if (error) return;
            setGroups(groups ?? []);
            setIsLoading(false);
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

    const tabTitle = (
        <>
            <Layers />
            Grupos
        </>
    );

    return (
        <Card tabTitle={tabTitle} tabSubtitle="Cada grupo es un área de tu bienestar. Cambia su color con la paleta.">
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => <GroupCardSkeleton key={i} />)}
                </div>
            ) : groups.length === 0 ? (
                <p className="text-primary-400 font-bold">No hay grupos disponibles.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {groups.map((group) => (
                        <article key={group.id} className="relative rounded-3xl bg-white/60 shadow-clay-sm p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <span
                                    className="size-10 rounded-full shrink-0 shadow-clay-pressed"
                                    style={{ background: `radial-gradient(circle at 32% 28%, #ffffffaa, ${group.color} 60%)` }}
                                />
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-heading font-bold text-primary-950 capitalize truncate">{group.name}</h3>
                                    <p className="text-xs text-primary-400">{group.categories?.length ?? 0} categorías</p>
                                </div>
                                <button
                                    type="button"
                                    aria-label={`Cambiar color de ${group.name}`}
                                    onClick={() => setOpenGroupId(openGroupId === group.id ? null : group.id)}
                                    className="size-9 rounded-full clay-knob flex items-center justify-center text-primary-500 hover:text-tertiary-600 transition cursor-pointer"
                                >
                                    <Palette size={16} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {group.categories?.slice(0, 8).map((cat) => (
                                    <span
                                        key={cat.id}
                                        title={cat.name}
                                        className="size-8 flex items-center justify-center rounded-xl"
                                        style={{ backgroundColor: hexToRgba(group.color, 0.16), color: group.color }}
                                    >
                                        <DynamicIcon name={cat.icon} size={15} />
                                    </span>
                                ))}
                                {(group.categories?.length ?? 0) > 8 && (
                                    <span className="text-xs font-bold text-primary-400 self-center">
                                        +{(group.categories?.length ?? 0) - 8}
                                    </span>
                                )}
                            </div>

                            {openGroupId === group.id && (
                                <div ref={pickerRef} className="absolute right-4 top-16 z-50">
                                    <ColorPicker
                                        value={group.color}
                                        onChange={(color) => handleColorChange(group.id, color)}
                                        showCopyButton={false}
                                        maxWidth={300}
                                    />
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </Card>
    );
};
