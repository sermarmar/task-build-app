import { useState } from "react";
import { Card, CardBody, CardTitle, CardHeader } from '../../../components/ux/Card';
import type { Task } from "../models/Task";
import type { Status } from "../models/Status";
import { TaskCard } from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

interface TasksColumnProps {
    status: Status;
    tasks: Task[];
}

export const TasksColumn: React.FC<TasksColumnProps> = ({ status, tasks }) => {
    
    const [tasksData, setTasksData] = useState(tasks)

    return (
        <Card className="h-full" color={`bg-${status.color}`} withPadding={false}>
            <CardHeader className="border-none rounded-t-lg p-4">
                <CardTitle className="text-base">{ status.name }</CardTitle>
            </CardHeader>
            
            <CardBody className="flex flex-col gap-4 mb-4 p-4">
                <Droppable droppableId={status.id.toString()}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {tasksData.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            
            </CardBody>
        </Card>
    );

}