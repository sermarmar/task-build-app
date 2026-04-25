import { Pill } from "lucide-react";
import { Calendar } from "../../components/template/calendar/Calendar";
import { Card, CardBody } from "../../components/ux/Card";
import { Checkbox } from "../../components/ux/Checkbox";

export const CalendarBoard: React.FC = () => {
    return (
        <Card color="bg-primary-950 text-tertiary-50">
            <Calendar />
            <hr className="border-tertiary-50 border-1 rounded-full my-6" />
            <CardBody className="flex items-center justify-between bg-secondary-700/45 border-tertiary-200">
                <div className=" flex gap-4 items-center p-4 rounded-lg border-l-2 ">
                    <span className="bg-tertiary-300 text-primary-900 w-10 h-10 flex items-center justify-center rounded-full">
                        <Pill />
                    </span>
                    <h3 className="text-md font-medium">Tomar medicina</h3>
                </div>
                {/* Add checkbox */}
            </CardBody>
        </Card>
    );
};