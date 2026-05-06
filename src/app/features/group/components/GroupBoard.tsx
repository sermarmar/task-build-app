import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle } from "@/app/components/ux/Card";
import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { GroupService } from "@/app/core/service/groups/GroupService";
import type { Group } from "../models/Group";

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const GroupBoard: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        GroupService.getAllGroups().then(({ groups, error }) => {
            if (error) return;
            setGroups(groups ?? []);
        });
    }, []);

    return (
        <Card className="w-full">
            <CardTitle>Grupos</CardTitle>
            <CardBody>
                {groups.length === 0 ? (
                    <p>No hay grupos disponibles.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="p-4 rounded-md border-l-5"
                                style={{
                                    backgroundColor: hexToRgba(group.color, 0.1),
                                    borderColor: group.color,
                                }}
                            >
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
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};