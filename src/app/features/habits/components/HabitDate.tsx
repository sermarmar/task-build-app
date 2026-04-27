import { twMerge } from "tailwind-merge";
import { Card, CardBody, CardTitle } from "../../../components/ux/Card"

interface HabitDateProps {
    day: string;
    numDay: number
    isActive: boolean;
    isToday?: boolean;
    onClick: () => void;
}

export const HabitDate: React.FC<HabitDateProps> = ({ day, numDay, isActive, isToday, onClick }) => {

    let activeClass = 'bg-secondary-400 text-tertiary-50 hover:bg-tertiary-900 hover:text-tertiary-50';
    if( isActive ) {
        activeClass = 'bg-primary-900 text-tertiary-50';
    } else if( isToday ) {
        activeClass = 'bg-tertiary-300 text-primary-900';
    }
    const activeTitleClass = isActive ? 'text-tertiary-50' : 'text-primary-900';

    return (
        <div onClick={ onClick }>
            <Card color={ activeClass } className="w-10 text-center rounded-full pt-1" withPadding={ false }>
                <CardTitle className={twMerge("text-sm font-light", activeTitleClass)}>
                    { day }
                </CardTitle>
                <CardBody className="font-bold bg-gray-400/45 rounded-4xl py-2">
                    { numDay }
                </CardBody>
            </Card>
        </div>
    )
}