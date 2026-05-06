import { useEffect, useState } from "react";
import type { Category } from "../../../core/models/Category";
import { useNotification } from "../../../contexts/notification/useNotification";
import { useForm } from "react-hook-form";
import type { CategoryRequest } from "../resources/CategoryRequest";
import { Card, CardTitle } from "../../../components/ux/Card";
import { Button } from "../../../components/ux/Button";
import { Input } from "../../../components/ux/Input";
import { Check, X } from "lucide-react";
import { IconsList } from "./IconsList";
import { useColorAlpha } from "../../../hooks/useColorAlpha";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
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
    const [previewColor, setPreviewColor] = useState('#6b7280');
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

    const previewBg = useColorAlpha(previewColor, 0.2);

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

    const handleGroupSelect = (group: Pick<Group, 'id' | 'name' | 'color'>) => {
        setValue("group_id", group.id);
        setPreviewColor(group.color);
    };

    const handleSubmitForm = async (form: CategoryRequest) => {
        if (isEdit && category) {
            const { error } = await CategoryService.updateCategory(category.id, form);
            if (error) {
                notifyMessage("danger", "Ha fallado al actualizar la categoría. Contactá con el administrador.", <X />);
            } else {
                notifyMessage("success", "Categoría actualizada correctamente.", <Check />);
                onClose();
            }
        } else {
            const { error } = await CategoryService.createCategory(form);
            if (error) {
                notifyMessage("danger", "Ha fallado al crear la categoría. Contactá con el administrador.", <X />);
            } else {
                notifyMessage("success", "Categoría creada correctamente.", <Check />);
                onClose();
            }
        }
    };

    const notifyMessage = (type: "success" | "danger", message: string, icon?: React.ReactElement) => {
        notify(
            <>
                { icon }
                <span>{ message }</span>
            </>,
            type
        )
    }

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
                <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-3 gap-5 mt-4">
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
                            selectedGroupId={watchedGroupId}
                            onSelect={(iconName) => setValue("icon", iconName)}
                            onSelectGroup={handleGroupSelect}
                        />
                    </div>

                    {/* Preview en tiempo real */}
                    <div
                        className="flex gap-4 items-center p-4 rounded-md border-l-5 w-full col-span-2"
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
