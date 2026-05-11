import { useEffect, useRef, useState } from "react";
import { Button, type ButtonSize } from "../ux/Button";
import { Card, CardBody } from "../ux/Card";
import { DynamicIcon } from "../ux/DynamicIcon";
import { GroupService } from "../../core/service/groups/GroupService";
import { CategoryService } from "../../core/service/categories/CategoryService";
import type { Group } from "../../features/group/models/Group";
import type { Category } from "../../core/models/Category";
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
    showAll?: boolean;
    onSelect?: (icon: string) => void;
    onSelectGroup?: (group: Pick<Group, 'id' | 'name' | 'color'>) => void;
    onSelectCategory?: (category: Category | null) => void;
}

export const IconsList: React.FC<IconsListProps> = ({
    selected,
    selectedGroupId,
    size = 'md',
    showAll = false,
    onSelect,
    onSelectGroup,
    onSelectCategory,
}) => {
    const { iconSize, className: triggerClass } = sizeConfig[size];
    const categoryMode = !!onSelectCategory;

    const [open, setOpen] = useState<boolean>(false);
    const [activeGroupId, setActiveGroupId] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // — icon mode state —
    const [groups, setGroups] = useState<Pick<Group, 'id' | 'name' | 'color'>[]>([]);

    // — category mode state —
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryGroups, setCategoryGroups] = useState<{ id: string; name: string; color: string }[]>([]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (categoryMode) {
            CategoryService.getAllCategories().then(({ categories: cats }) => {
                if (!cats) return;
                setCategories(cats);
                const seen = new Set<string>();
                const derived = cats
                    .filter(c => c.group_id && c.group)
                    .reduce<{ id: string; name: string; color: string }[]>((acc, c) => {
                        if (!seen.has(c.group_id!)) {
                            seen.add(c.group_id!);
                            acc.push({ id: c.group_id!, name: c.group!.name, color: c.group!.color });
                        }
                        return acc;
                    }, []);
                setCategoryGroups(derived);
                setActiveGroupId(prev => prev || derived[0]?.id || '');
            });
        } else {
            GroupService.getGroupsForSelect().then(({ groups: g }) => {
                if (g && g.length > 0) {
                    setGroups(g);
                    setActiveGroupId(prev => prev || g[0].id);
                }
            });
        }
    }, [categoryMode]);

    useEffect(() => {
        if (selectedGroupId) setActiveGroupId(selectedGroupId);
    }, [selectedGroupId]);

    // — icon mode —
    const iconsList: Icon[] = icons.map(i => ({ key: i.key, label: i.label, icon: i.icon, group: i.group }));
    const activeIconGroup = groups.find(g => g.id === activeGroupId);
    const filteredIcons = activeIconGroup ? iconsList.filter(i => i.group === activeIconGroup.name) : [];

    // — category mode —
    const activeCategoryGroup = categoryGroups.find(g => g.id === activeGroupId);
    const filteredCategories = activeCategoryGroup
        ? categories.filter(c => c.group_id === activeCategoryGroup.id)
        : [];

    const displayIcon = selectedCategory?.icon ?? selected ?? 'Smile';
    const triggerColor = selectedCategory?.group?.color ?? activeCategoryGroup?.color ?? activeIconGroup?.color;

    const handleSelectCategory = (cat: Category | null) => {
        setSelectedCategory(cat);
        onSelectCategory!(cat);
        setOpen(false);
    };

    const activeGroups = categoryMode ? categoryGroups : groups;

    return (
        <div className="relative" ref={containerRef}>
            <Button
                type='button'
                form="pill"
                color="tertiary"
                style={triggerColor ? { backgroundColor: triggerColor } : undefined}
                className={triggerClass}
                onClick={() => setOpen(!open)}
            >
                <DynamicIcon name={displayIcon} size={iconSize} />
            </Button>

            <Card className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 w-80 ${open ? 'block' : 'hidden'}`}>
                <div className="flex overflow-x-auto gap-1 p-2 border-b border-gray-200">
                    {showAll && categoryMode && (
                        <button
                            type="button"
                            onClick={() => handleSelectCategory(null)}
                            className="text-xs px-2 py-1 rounded-full whitespace-nowrap bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                            Todos
                        </button>
                    )}
                    {activeGroups.map((group) => (
                        <button
                            key={group.id}
                            type="button"
                            onClick={() => {
                                setActiveGroupId(group.id);
                                if (!categoryMode) onSelectGroup?.(group);
                            }}
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
                                activeGroupId === group.id ? 'text-tertiary-50' : 'text-secondary-600 hover:bg-tertiary-100'
                            }`}
                            style={activeGroupId === group.id ? { backgroundColor: group.color } : undefined}
                        >
                            {group.name}
                        </button>
                    ))}
                </div>

                <CardBody className="grid grid-cols-5 gap-2 overflow-y-auto h-64 p-3">
                    {categoryMode
                        ? filteredCategories.map((cat) => (
                            <div key={cat.id} className="flex flex-col gap-1 justify-center items-center">
                                <Button
                                    type="button"
                                    form="pill"
                                    color="tertiary"
                                    style={activeCategoryGroup ? { backgroundColor: activeCategoryGroup.color } : undefined}
                                    className="flex flex-col items-center justify-center w-10 h-10"
                                    onClick={() => handleSelectCategory(cat)}
                                >
                                    <DynamicIcon name={cat.icon} />
                                </Button>
                                <span className="text-xs text-center leading-tight text-gray-500 w-full truncate">
                                    {cat.name}
                                </span>
                            </div>
                        ))
                        : filteredIcons.map((icon) => (
                            <div key={`${icon.key}-${icon.group}`} className="flex flex-col gap-1 justify-center items-center">
                                <Button
                                    type="button"
                                    form="pill"
                                    color="tertiary"
                                    style={activeIconGroup ? { backgroundColor: activeIconGroup.color } : undefined}
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
                        ))
                    }
                </CardBody>
            </Card>
        </div>
    );
};