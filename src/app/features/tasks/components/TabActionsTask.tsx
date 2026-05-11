import { Plus } from "lucide-react";
import { Button } from "../../../components/ux/Button";
import { Input } from "@/app/components/ux/Input";
import { BadgeStatusDynamic } from "@/app/components/template/status/BadgeStatusDynamic";
import { IconsList } from "@/app/components/template/IconsList";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";

interface TabActionsTaskProps {
    onCreateClick: () => void;
}

export const TabActionsTask: React.FC<TabActionsTaskProps> = ({ onCreateClick }) => {
    const { setFilters } = useTaskBoardContext();

    return (
        <div className="flex gap-2 items-center">
            <BadgeStatusDynamic
                showAll
                onChange={status => setFilters(prev => ({ ...prev, statusId: status?.id ?? null }))}
            />
            <Input
                name="Buscar"
                type="text"
                size="sm"
                placeholder="Buscar tareas..."
                onChange={e => setFilters(prev => ({ ...prev, text: e.target.value }))}
            />
            <IconsList
                size="sm"
                showAll
                onSelectCategory={category => setFilters(prev => ({ ...prev, categoryId: category?.id ?? null }))}
            />
            <Button
                type="button"
                color="primary"
                form="pill"
                size="sm"
                className="text-sm"
                onClick={onCreateClick}
            >
                <Plus />
            </Button>
        </div>
    );
}
