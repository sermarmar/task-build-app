
import { BadgeStatusDynamic } from '../../../components/template/status/BadgeStatusDynamic';
import { Card, CardBody, CardText, CardTitle } from '../../../components/ux/Card';
import type { Task } from '../models/Task';

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <Card className='border border-gray-300'>
            <CardTitle className="text-sm">{ task.title }</CardTitle>
            <CardBody className="text-xs text-gray-600 mt-2 flex justify-between items-center">
                <CardText>{ task.category?.name }</CardText>
                <CardText>
                    <BadgeStatusDynamic taskId={ task.id! } status={ task.status } />
                </CardText>
            </CardBody>
        </Card>
    );
}