import { useEffect, useState } from "react";
import type { Status } from "../../../core/models/Status";
import { StatusService } from "../../../core/service/status/StatusService";
import { Select } from "../../ux/Select";

export const SelectStatus = () => {

    const [status, setStatus] = useState<Status[]>([]);

    useEffect(() => {
        StatusService.getAllStatus().then((res) => {
            setStatus(res.status || []);
        });
    }, []);

    return (
        <Select 
            name="status" 
            label="Estado" 
            list={ status } 
            onChange={() => {}} 
            className="mb-4"
            getOptionValue={(state: Status) => state.id}
            getOptionLabel={(state: Status) => state.name}
        />
    );
}