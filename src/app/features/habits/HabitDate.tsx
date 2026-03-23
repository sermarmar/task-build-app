import { Card, CardBody, CardTitle } from "../../components/ux/Card"

interface HabitDateProps {
    day: string;
    numDay: number
    isActive: boolean;
    onClick: () => void;
}

export const HabitDate: React.FC<HabitDateProps> = ({ day, numDay, isActive, onClick }) => {

    const activeClass = isActive : 'bg-gradient-to-r from-accent-from to-accent-to text-white' ? 'bg-gray-100'

    return (
        <div onClick={ onClick }>
            <Card color={`bg-gray-100 w-10 text-center`} withPadding={ false }>
                <CardTitle className="text-sm">
                    { day }
                </CardTitle>
                <CardBody>
                    { numDay }
                </CardBody>
            </Card>
        </div>
    )
}