import { useEffect, useState } from "react";
import type { Category } from "../../../core/models/Category";
import { useNotification } from "../../../contexts/notification/useNotification";
import { useForm } from "react-hook-form";
import type { CategoryRequest } from "../resources/CategoryRequest";
import { Card, CardTitle } from "../../../components/ux/Card";
import { Button } from "../../../components/ux/Button";
import { Input } from "../../../components/ux/Input";
import { X } from "lucide-react";
import { IconsList } from "./IconsList";
import { useColorAlpha } from "../../../hooks/useColorAlpha";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import { GroupService } from "../../../core/service/groups/GroupService";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import type { Group } from "../../group/models/Group";

interface ModalFormCategoryProps {
    show: boolean;
    isEdit?: boolean;
    category?: Category | null;
    onClose: () => void;
}

export const ModalFormCategory: React.FC<ModalFormCategoryProps> = ({ show, isEdit, category, onClose }) => {

    const [visible, setVisible] = useState(show);
    const [groups, setGroups] = useState<Pick<Group, 'id' | 'name' | 'color'>[]>([]);
    const { notify } = useNotification();

    const { register, handleSubmit, watch, setValue, reset } = useForm<CategoryRequest>({
        defaultValues: {
            name: '',
            description: '',
            icon: 'Star',
            group_id: '',
        }
    });

    const watchedName = watch("name");
    const watchedDescription = watch("description");
    const watchedIcon = watch("icon");
    const watchedGroupId = watch("group_id");

    const selectedGroup = groups.find(g => g.id === watchedGroupId);
    const previewColor = selectedGroup?.color ?? '#6b7280';
    const previewBg = useColorAlpha(previewColor, 0.2);

    useEffect(() => {
        GroupService.getGroupsForSelect().then(({ groups }) => {
            if (groups) setGroups(groups);
        });
    }, []);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    useEffect(() => {
        if (isEdit && category) {
            reset({
                name: category.name ?? '',
                description: category.description ?? '',
                icon: category.icon ?? 'Star',
                group_id: category.group_id ?? '',
            });
        } else {
            reset({ name: '', description: '', icon: 'Star', group_id: '' });
        }
    }, [isEdit, category, reset]);

    if (!visible) return null;

    const handleCreateCategory = async (_form: CategoryRequest) => {
        CategoryService.clearCache();
        notify(isEdit ? "Categoría editada correctamente" : "Categoría creada correctamente");
        onClose();
    };

    return (
        <div
            id="modal-form-category"
            tabIndex={-1}
            className={`fixed inset-0 z-50 flex items-center justify-center -top-50 transition-all duration-300 ${
                show ? "backdrop-blur-sm opacity-100" : "backdrop-blur-none opacity-0"
            }`}
        >
            <Card
                className={`relative p-4 w-300 mx-auto mt-20 transform transition-all duration-300 ${
                    show ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                <CardTitle className="flex justify-between items-center">
                    {isEdit ? "Editar categoría" : "Crear nueva categoría"}
                    <X className="cursor-pointer" onClick={onClose} />
                </CardTitle>
                <form onSubmit={handleSubmit(handleCreateCategory)} className="grid grid-cols-3 gap-5 mt-4">
                    <div>
                        <Input
                            label="Nombre de la categoría"
                            type="text"
                            placeholder="Escribe un nombre para la categoría"
                            {...register("name", { required: "El nombre es obligatorio" })}
                        />
                    </div>
                    <div>
                        <Input
                            label="Descripción"
                            type="text"
                            placeholder="Escribe una descripción para la categoría"
                            {...register("description")}
                        />
                    </div>
                    <div className="flex items-center">
                        <IconsList
                            selected={watchedIcon}
                            onSelect={(iconName) => setValue("icon", iconName)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-primary-900">Grupo</label>
                        <select
                            className="border border-tertiary-300 rounded-md px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                            {...register("group_id", { required: "El grupo es obligatorio" })}
                        >
                            <option value="">Selecciona un grupo</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Preview en tiempo real */}
                    <div
                        className="flex gap-4 items-center p-4 rounded-md border-l-5 w-full"
                        style={{ backgroundColor: previewBg, borderColor: previewColor }}
                    >
                        <span
                            className="text-tertiary-50 w-10 h-10 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: previewColor }}
                        >
                            <DynamicIcon name={watchedIcon} />
                        </span>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-md font-bold">{watchedName || "Nombre de categoría"}</h3>
                            <h5 className="text-sm text-secondary-800">{watchedDescription || "Descripción de la categoría"}</h5>
                        </div>
                    </div>

                    <div className="flex col-span-3 justify-end">
                        <Button type="submit">
                            {isEdit ? "Guardar cambios" : "Crear categoría"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};