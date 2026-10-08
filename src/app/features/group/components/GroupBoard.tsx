import { useEffect, useRef, useState } from "react";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import { Card } from "@/app/components/ux/Card";
import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { ColorPicker } from "@/app/components/template/ColorPicker";
import { GroupService } from "@/app/core/service/groups/GroupService";
import type { Group } from "../models/Group";
import icons from "@/app/shared/icons.json";
import { Layers, Palette } from "lucide-react";

type Picker = { groupId: string; kind: 'color' | 'icon' };

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const GroupCardSkeleton: React.FC = () => (
    <div className="rounded-3xl bg-white/50 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-2xl shrink-0" />
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
    const [picker, setPicker] = useState<Picker | null>(null);
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
                setPicker(null);
            }
        };
        if (picker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [picker]);

    const togglePicker = (groupId: string, kind: Picker['kind']) => {
        setPicker(prev => prev?.groupId === groupId && prev.kind === kind ? null : { groupId, kind });
    };

    const handleColorChange = async (groupId: string, color: string) => {
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, color } : g));
        await GroupService.updateGroupColor(groupId, color);
    };

    const handleIconChange = async (groupId: string, icon: string) => {
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, icon } : g));
        setPicker(null);
        await GroupService.updateGroupIcon(groupId, icon);
    };

    const tabTitle = (
        <>
            <Layers />
            Grupos
        </>
    );

    return (
        <Card tabTitle={tabTitle} tabSubtitle="Cada grupo es un área de tu bienestar. Toca su icono para cambiarlo o usa la paleta para el color.">
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
                                <button
                                    type="button"
                                    aria-label={`Cambiar icono de ${group.name}`}
                                    onClick={() => togglePicker(group.id, 'icon')}
                                    className="size-10 rounded-2xl shrink-0 flex items-center justify-center text-white shadow-clay-pressed cursor-pointer"
                                    style={{ background: `linear-gradient(160deg, ${group.color}aa, ${group.color})` }}
                                >
                                    <DynamicIcon name={group.icon} size={20} />
                                </button>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-heading font-bold text-primary-950 capitalize truncate">{group.name}</h3>
                                    <p className="text-xs text-primary-400">{group.categories?.length ?? 0} categorías</p>
                                </div>
                                <button
                                    type="button"
                                    aria-label={`Cambiar color de ${group.name}`}
                                    onClick={() => togglePicker(group.id, 'color')}
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
                                        className="size-8 flex items-center justify-center rounded-xl text-white shadow-clay-pressed"
                                        style={{ background: `linear-gradient(160deg, ${group.color}aa, ${group.color})` }}
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

                            {picker?.groupId === group.id && picker.kind === 'icon' && (
                                <div ref={pickerRef} className="absolute inset-x-2 top-16 z-50 flex flex-wrap justify-center gap-2 rounded-3xl bg-surface shadow-clay p-3">
                                    {icons.filter(i => i.group === group.name.toLowerCase()).map(i => (
                                        <button
                                            key={i.key}
                                            type="button"
                                            title={i.label}
                                            onClick={() => handleIconChange(group.id, i.icon)}
                                            className="size-10 rounded-xl flex items-center justify-center transition hover:scale-105 cursor-pointer"
                                            style={i.icon === group.icon
                                                ? { background: group.color, color: 'white' }
                                                : { backgroundColor: hexToRgba(group.color, 0.16), color: group.color }}
                                        >
                                            <DynamicIcon name={i.icon} size={18} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {picker?.groupId === group.id && picker.kind === 'color' && (
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
