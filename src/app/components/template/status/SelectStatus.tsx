import { useEffect, useState } from "react";
import type { Status } from "../../../core/models/Status";
import { StatusService } from "../../../core/service/status/StatusService";
import { Select } from "../../ux/Select";

interface SelectStatusProps {
    onChange: (status: Status) => void;
}

export const SelectStatus = ({ onChange }: SelectStatusProps) => {

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
            onChange={(e) => {
                const selected = status.find(s => s.id === e.target.value);
                if (selected) onChange(selected);
            }} 
            className="mb-4"
            getOptionValue={(state: Status) => state.id}
            getOptionLabel={(state: Status) => state.name}
        />
    );
}