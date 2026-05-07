import { useEffect, useRef, useState } from "react";
import { Button, type ButtonSize } from "../ux/Button";
import { Card, CardBody } from "../ux/Card";
import { DynamicIcon } from "../ux/DynamicIcon";
import { GroupService } from "../../core/service/groups/GroupService";
import type { Group } from "../../features/group/models/Group";
import icons from '../../shared/icons.json';

interface Icon {
    key: string;
    label: string;
    icon: string;
    group: string;
}

const sizeConfig: Record<ButtonSize, { iconSize: number; className: string }> = {
    sm: { iconSize: 20, className: 'p-2' },
    md: { iconSize: 24, className: 'p-4' },
    lg: { iconSize: 32, className: 'p-6' },
};

interface IconsListProps {
    selected?: string;
    selectedGroupId?: string;
    size?: ButtonSize;
    onSelect?: (icon: string) => void;
    onSelectGroup?: (group: Pick<Group, 'id' | 'name' | 'color'>) => void;
}

export const IconsList: React.FC<IconsListProps> = ({ selected, selectedGroupId, size = 'md', onSelect, onSelectGroup }) => {
    const { iconSize, className: triggerClass } = sizeConfig[size];

    const [open, setOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [groups, setGroups] = useState<Pick<Group, 'id' | 'name' | 'color'>[]>([]);
    const [activeGroupId, setActiveGroupId] = useState<string>('');

    useEffect(() => {
        GroupService.getGroupsForSelect().then(({ groups }) => {
            if (groups && groups.length > 0) {
                setGroups(groups);
                setActiveGroupId(prev => prev || groups[0].id);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedGroupId) setActiveGroupId(selectedGroupId);
    }, [selectedGroupId]);

    const iconsList: Icon[] = icons.map((icon) => ({
        key: icon.key,
        label: icon.label,
        icon: icon.icon,
        group: icon.group,
    }));

    const activeGroup = groups.find(g => g.id === activeGroupId);
    const filteredIcons = activeGroup
        ? iconsList.filter(icon => icon.group === activeGroup.name)
        : [];

    const displayIcon = selected ?? "Smile";

    return (
        <div className="relative" ref={containerRef}>
            <Button
                type='button'
                form="pill"
                color="tertiary"
                style={activeGroup ? { backgroundColor: activeGroup.color } : undefined}
                className={triggerClass}
                onClick={() => setOpen(!open)}
            >
                <DynamicIcon name={displayIcon} size={iconSize} />
            </Button>

            <Card className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 w-80 ${open ? 'block' : 'hidden'}`}>

                <div className="flex overflow-x-auto gap-1 p-2 border-b border-gray-200">
                    {groups.map((group) => (
                        <button
                            key={group.id}
                            type="button"
                            onClick={() => {
                                setActiveGroupId(group.id);
                                onSelectGroup?.(group);
                            }}
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
                                activeGroupId === group.id
                                    ? "text-tertiary-50"
                                    : "text-secondary-600 hover:bg-tertiary-100"
                            }`}
                            style={activeGroupId === group.id ? { backgroundColor: group.color } : undefined}
                        >
                            {group.name}
                        </button>
                    ))}
                </div>

                <CardBody className="grid grid-cols-5 gap-2 overflow-y-auto h-64 p-3">
                    {filteredIcons.map((icon) => (
                        <div
                            key={`${icon.key}-${icon.group}`}
                            className="flex flex-col gap-1 justify-center items-center"
                        >
                            <Button
                                type="button"
                                form="pill"
                                color="tertiary"
                                style={activeGroup ? { backgroundColor: activeGroup.color } : undefined}
                                className="flex flex-col items-center justify-center w-10 h-10"
                                onClick={() => {
                                    onSelect?.(icon.icon);
                                    setOpen(false);
                                }}
                            >
                                <DynamicIcon name={icon.icon} />
                            </Button>
                            <span className="text-xs text-center leading-tight text-gray-500 w-full truncate">
                                {icon.label}
                            </span>
                        </div>
                    ))}
                </CardBody>
            </Card>
        </div>
    );
};