import { Plus, Tags } from "lucide-react";
import { Button } from "../../../components/ux/Button";
import { Card } from "../../../components/ux/Card";
import { CategoriesList } from "./CategoriesList";
import { ModalFormCategory } from "./ModalFormCategory";
import { useState } from "react";
import type { Category } from "../../../core/models/Category";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import { useNotification } from "../../../contexts/notification/useNotification";
import { Check, X } from "lucide-react";
import { useCategoryBoardContext } from "../contexts/useCategoryBoardContext";

export const CategoryBoard: React.FC = () => {

    const { notify } = useNotification();
    const { refreshCategories } = useCategoryBoardContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        refreshCategories();
    };

    const handleDelete = async (category: Category) => {
        const { error } = await CategoryService.deleteCategory(category.id);
        if (error) {
            notify(<><X /><span>No se pudo eliminar la categoría.</span></>, "danger");
        } else {
            notify(<><Check /><span>Categoría eliminada correctamente.</span></>, "success");
            refreshCategories();
        }
    };

    const tabTitle = (
        <>
            <Tags />
            Categorías
        </>
    );

    const tabActions = (
        <Button type='button' color='tertiary' form='rounded' onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva categoría</span>
        </Button>
    );

    return(
        <>
            <Card tabTitle={tabTitle} tabSubtitle="Clasifica tus tareas y hábitos." tabActions={tabActions}>
                <CategoriesList onEdit={handleEdit} onDelete={handleDelete} />
            </Card>
            <ModalFormCategory
                show={isModalOpen}
                isEdit={!!selectedCategory}
                category={selectedCategory}
                onClose={handleClose}
            />
        </>
    );

}
