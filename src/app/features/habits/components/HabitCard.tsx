import { useState } from "react";
import { Card } from "../../../components/ux/Card";
import { Checkbox } from "../../../components/ux/Checkbox";
import type { Habit } from "../models/Habit";

interface HabitCardProps {
    habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {

    const [checked, setChecked] = useState(false);

    return (
        <Card>
            <div className="flex items-center">
                <Checkbox
                    label={habit.title}
                    checked={checked} onChange={setChecked}
                />
            </div>
        </Card>
    );
}