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

    let activeClass = 'bg-gray-100';
    if( isActive ) {
        activeClass = 'bg-gradient-to-r from-accent-from to-accent-to text-white';
    } else if( isToday ) {
        activeClass = 'bg-gradient-to-r from-red-from to-red-to text-white';
    }
    const activeTitleClass = isActive ? 'text-white' : 'text-black';

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