import { Plus } from "lucide-react";
import { Button } from "../../../components/ux/Button";
import { Input } from "@/app/components/ux/Input";
import { IconsList } from "@/app/components/template/IconsList";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";

interface TabActionsHabitProps {
    onCreateClick: () => void;
}

export const TabActionsHabit: React.FC<TabActionsHabitProps> = ({ onCreateClick }) => {
    const { setFilters } = useHabitBoardContext();

    return (
        <div className="flex gap-2 items-center">
            <Input
                name="Buscar"
                type="text"
                size="sm"
                placeholder="Buscar hábitos..."
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
