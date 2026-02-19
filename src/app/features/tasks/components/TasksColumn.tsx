import { useState } from "react";
import { Card, CardBody, CardTitle, CardHeader } from '../../../components/ux/Card';

interface TasksColumnProps {
    status: Status;
    tasks: any[];
}

export const TasksColumn: React.FC<TasksColumnProps> = ({ status, tasks }) => {
    
    const [tasksData, setTasksData] = useState(tasks)

    return (
        <Card className="h-full" color={`bg-${status.color}`} withPadding={false}>
            <CardHeader className="border-none rounded-t-lg p-4">
                <CardTitle className="text-base">{ status.name }</CardTitle>
            </CardHeader>
            
            <CardBody className="flex flex-col gap-4 mb-4 p-4">
            { tasksData.map((t, i) => (
                <div key={i}>{ t.title }</div>
            )) }
            {
                tasksData.length === 0 && (
                <div className="text-gray-500 text-center">
                    No hay tareas en esta columna
                </div>
                )
            }
            </CardBody>
        </Card>
    );

}