import { Calendar } from "../../components/template/calendar/Calendar";
import { Card } from "../../components/ux/Card";

export const CalendarBoard: React.FC = () => {
    return (
        <Card color="bg-primary-950 text-tertiary-50">
            <Calendar />
        </Card>
    );
};