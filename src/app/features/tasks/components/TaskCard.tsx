
import { Draggable } from '@hello-pangea/dnd';
import { Badge } from '../../../components/ux/Badge';
import { Card, CardBody, CardText, CardTitle } from '../../../components/ux/Card';
import type { Task } from '../models/Task';

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <Draggable draggableId={task.id.toString()} index={0}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Card className='border border-gray-300'>
                        <CardTitle className="text-sm">{ task.title }</CardTitle>
                        <CardBody className="text-xs text-gray-600 mt-2 flex justify-between items-center">
                            <CardText>{ task.category }</CardText>
                            <CardText>
                                <Badge color={task.priority.color} text={task.priority.name} />
                            </CardText>
                        </CardBody>
                    </Card>
                </div>
            )}
        </Draggable>
    );
}