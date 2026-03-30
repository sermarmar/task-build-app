import { useState } from "react";
import { Card } from "../../../components/ux/Card";
import { Checkbox } from "../../../components/ux/Checkbox";

export const HabitCard: React.FC = () => {

    const [checked, setChecked] = useState(false);

    return (
        <Card>
            <div className="flex items-center">
                <Checkbox
                    label="Prueba"
                    checked={checked} onChange={setChecked}
                />
            </div>
        </Card>
    );
}