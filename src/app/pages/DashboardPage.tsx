
import { ClipboardList, ClockFading } from "lucide-react";
import { Navbar } from "../components/template/Navbar";
import { Card, CardTitle } from "../components/ux/Card";

export const DashboardPage: React.FC = () => {

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className = "grid grid-cols-3 gap-4 mt-20 mx-4">
                
                <Card className="col-span-2">
                    <CardTitle className="flex gap-2 items-center">
                        <ClipboardList />
                        Mis Tareas
                    </CardTitle>
                </Card>
            </div>
        </div>
    );
}