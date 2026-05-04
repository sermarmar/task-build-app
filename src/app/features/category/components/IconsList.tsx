import { useState } from "react";
import { Button } from "../../../components/ux/Button";
import { Card, CardBody } from "../../../components/ux/Card";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import icons from '../../../shared/icons.json';

interface Icon {
    key: string;
    label: string;
    icon: string;
    group: string;
}

const GROUP_LABELS: Record<string, string> = {
    salud: "Salud",
    productividad: "Productividad",
    bienestar: "Bienestar",
    hogar: "Hogar",
    finanzas: "Finanzas",
    social: "Social",
    aprendizaje: "Aprendizaje",
};

interface IconsListProps {
    selected?: string;           // 👈 nombre del icono activo (viene del form)
    onSelect?: (icon: string) => void;  // 👈 notifica al form cuando el usuario elige
}

export const IconsList: React.FC<IconsListProps> = ({ selected, onSelect }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [activeGroup, setActiveGroup] = useState<string>("salud");

    const iconsList: Icon[] = icons.map((icon) => ({
        key: icon.key,
        label: icon.label,
        icon: icon.icon,
        group: icon.group,
    }));

    const groups = Object.keys(GROUP_LABELS);
    const filteredIcons = iconsList.filter((icon) => icon.group === activeGroup);

    // 👇 Deriva el icono a mostrar en el botón desde la prop, no desde estado local
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
                            key={group}
                            type="button"
                            onClick={() => setActiveGroup(group)}
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
                                activeGroup === group
                                    ? "bg-primary-900 text-tertiary-50"
                                    : "text-secondary-600 hover:bg-tertiary-100"
                            }`}
                        >
                            {GROUP_LABELS[group]}
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
                                // 👇 Compara con la prop `selected` en vez del estado local
                                color={selected === icon.icon ? "primary" : "tertiary"}
                                className="flex flex-col items-center justify-center w-10 h-10"
                                onClick={() => {
                                    onSelect?.(icon.icon); // 👈 notifica al padre
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