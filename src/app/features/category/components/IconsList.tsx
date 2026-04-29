import { useState } from "react";
import { Button } from "../../../components/ux/Button";
import { Card, CardBody } from "../../../components/ux/Card";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import icons from '../../../shared/icons.json';

interface Icon {
    key: string,
    label: string,
    icon: string,
    group: string
}

export const IconsList: React.FC = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [selectIcon, setSelectIcon] = useState<Icon>();

    const iconsList: Icon[] = icons.map((icon) => ({
        key: icon.key,
        label: icon.label,
        icon: icon.icon,
        group: icon.group,
    }));

    return (
        <>
            <Button type='button' form="pill" color="tertiary" className="p-3" onClick={() => setOpen(!open)}>
                <DynamicIcon name="Pill"/>
            </Button>
            <Card className={`fixed top-35 right-60 w-[100%] ${open ? 'block' : 'hidden'}`}>
                <CardBody className={`grid grid-cols-10 gap-y-2 gap-x-5 overflow-y-auto overflow-x-hidden h-80`}>
                    {iconsList.map((icon) => (
                        <div className ='flex flex-col gap-2 justify-center items-center'>
                            <Button key={icon.key} type="button" form="pill" className="flex flex-col items-center justify-center w-12 h-12">
                                <DynamicIcon name={icon.icon} />
                            </Button>
                            <span>{icon.label}</span>
                        </div>
                    ))}
                </CardBody>
            </Card>
        </>
    );
}