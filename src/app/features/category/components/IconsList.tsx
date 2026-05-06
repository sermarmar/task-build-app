import { useEffect, useState } from "react";
import { Button } from "../../../components/ux/Button";
import { Card, CardBody } from "../../../components/ux/Card";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import { GroupService } from "../../../core/service/groups/GroupService";
import type { Group } from "../../group/models/Group";
import icons from '../../../shared/icons.json';

interface Icon {
    key: string;
    label: string;
    icon: string;
    group: string;
}

interface IconsListProps {
    selected?: string;
    selectedGroupId?: string;
    onSelect?: (icon: string) => void;
    onSelectGroup?: (group: Pick<Group, 'id' | 'name' | 'color'>) => void;
}

export const IconsList: React.FC<IconsListProps> = ({ selected, selectedGroupId, onSelect, onSelectGroup }) => {

    const [open, setOpen] = useState<boolean>(false);
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
        ? iconsList.filter(icon => icon.group === activeGroup.name.toLowerCase())
        : iconsList;

    const displayIcon = selected ?? "Smile";

    return (
        <>
            <Button
                type='button'
                form="pill"
                color="tertiary"
                className="p-3"
                onClick={() => setOpen(!open)}
            >
                <DynamicIcon name={displayIcon} />
            </Button>

            <Card className={`fixed top-35 right-60 w-80 ${open ? 'block' : 'hidden'}`}>

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
                            key={icon.key}
                            className="flex flex-col gap-1 justify-center items-center"
                        >
                            <Button
                                type="button"
                                form="pill"
                                color={selected === icon.icon ? "primary" : "tertiary"}
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
        </>
    );
};