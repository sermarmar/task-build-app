import { useEffect, useState } from "react";
import type { Category } from "../../../core/models/Category";
import { useNotification } from "../../../contexts/notification/useNotification";
import { useForm } from "react-hook-form";
import type { CategoryRequest } from "../resources/CategoryRequest";
import { Modal } from "../../../components/ux/Modal";
import { Button } from "../../../components/ux/Button";
import { Input } from "../../../components/ux/Input";
import { Check, X } from "lucide-react";
import { IconsList } from "../../../components/template/IconsList";
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

    const [previewColor, setPreviewColor] = useState('#9580b5');
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
        <Modal
            show={show}
            onClose={onClose}
            title={isEdit ? "Editar categoría" : "Nueva categoría"}
            subtitle="Elige un grupo y un icono para reconocerla de un vistazo."
            className="max-w-3xl"
        >
            <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="md:col-span-2 flex items-center gap-5 rounded-3xl bg-white/40 shadow-clay-inset p-5">
                    <div className="flex flex-col items-center gap-2">
                        <IconsList
                            selected={watchedIcon}
                            selectedGroupId={watchedGroupId}
                            onSelect={(iconName) => setValue("icon", iconName)}
                            onSelectGroup={handleGroupSelect}
                            size="md"
                        />
                        <span className="text-xs font-bold text-primary-400">Icono</span>
                    </div>

                    <div className="flex-1 flex gap-4 items-center p-4 rounded-2xl bg-surface shadow-clay-sm">
                        <span
                            className="size-12 flex items-center justify-center rounded-2xl shrink-0 text-white shadow-clay-pressed"
                            style={{ background: `linear-gradient(160deg, ${previewColor}aa, ${previewColor})` }}
                        >
                            <DynamicIcon name={watchedIcon} />
                        </span>
                        <div className="min-w-0">
                            <h3 className="font-bold text-primary-950 truncate">{watchedName || "Nombre de categoría"}</h3>
                            <p className="text-sm text-primary-400 truncate">{watchedDescription || "Descripción de la categoría"}</p>
                        </div>
                    </div>
                </div>

                <div className="flex md:col-span-2 justify-end">
                    <Button type="submit" color="tertiary" form="rounded" size="lg">
                        {isEdit ? "Guardar cambios" : "Crear categoría"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
