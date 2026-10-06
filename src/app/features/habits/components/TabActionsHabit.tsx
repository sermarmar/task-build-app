import { Plus, Search } from "lucide-react";
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
        <div className="flex flex-wrap gap-3 items-center">
            <div className="w-full sm:w-60">
                <Input
                    name="Buscar"
                    type="search"
                    size="sm"
                    icon={<Search />}
                    placeholder="Buscar hábitos…"
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
                Nuevo hábito
            </Button>
        </div>
    );
}
