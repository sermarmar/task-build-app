
import { ClipboardList } from "lucide-react";
import { Navbar } from "../components/template/Navbar";
import { Card, CardTitle } from "../components/ux/Card";
import { Pomodoro } from "../components/template/Pomodoro";

export const DashboardPage: React.FC = () => {

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className = "grid grid-cols-3 gap-4 mt-20 mx-4">
                <div>
                    <Pomodoro />
                </div>
                <div className="col-span-2">
                    <Card >
                        <CardTitle className="flex gap-2 items-center">
                            <ClipboardList />
                            Mis Tareas
                        </CardTitle>
                    </Card>
                </div>
                
            </div>
        </div>
    );
}