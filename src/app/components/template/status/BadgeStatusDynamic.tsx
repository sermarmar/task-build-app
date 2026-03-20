import { useEffect, useState } from "react";
import type { Status } from "../../../core/models/Status";
import { Badge } from '../../ux/Badge';
import { StatusService } from "../../../core/service/status/StatusService";
import { UpdateTaskService } from "../../../features/tasks/services/UpdateTaskService";


interface BadgeStatusDynamicProps {
    taskId: string;
    status: Status;
}


export const BadgeStatusDynamic: React.FC<BadgeStatusDynamicProps> = ({ taskId, status }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [statuses, setStatuses] = useState<Status[]>([]);

    useEffect(() => {
      StatusService.getAllStatus().then((response) => {
        setStatuses(response.status || []);
      });
    }, [])
    
    const handleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleChangeStatus = (statusId: number) => {
        UpdateTaskService.updateByStatus(taskId, statusId).then((response) => {
            if(response.error) {
                console.error('Error updating task status:', response.error);
            } else {
                console.log('Task status updated successfully:', response.taskUpdated);
            }
        });
        setIsOpen(false);
    }

    return (
        <div className="cursor-default">
            <div onClick={ handleOpen }>
                <Badge color={ status.color } text={ status.name } />
            </div>
            {isOpen && (
                <div className="absolute bg-white border border-gray-300 rounded shadow p-2 mt-1 grid gap-1 grid-cols-3">
                    {statuses.map((status) => (
                        <Badge key={status.id} color={status.color} text={status.name} onClick={() => handleChangeStatus(status.id)} />
                    ))}
                </div>
            )}
        </div>
    )

}