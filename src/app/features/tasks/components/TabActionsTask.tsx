import { Plus, Search } from "lucide-react";
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
        <div className="flex flex-wrap gap-3 items-center">
            <BadgeStatusDynamic
                showAll
                onChange={status => setFilters(prev => ({ ...prev, statusId: status?.id ?? null }))}
            />
            <div className="w-full sm:w-60">
                <Input
                    name="Buscar"
                    type="search"
                    size="sm"
                    icon={<Search />}
                    placeholder="Buscar tareas…"
                    onChange={e => setFilters(prev => ({ ...prev, text: e.target.value }))}
                />
            </div>
            <IconsList
                size="sm"
                showAll
                onSelectCategory={category => setFilters(prev => ({ ...prev, categoryId: category?.id ?? null }))}
            />
            <Button type="button" color="tertiary" form="rounded" onClick={onCreateClick}>
                <Plus size={18} />
                Nueva tarea
            </Button>
        </div>
    );
}
