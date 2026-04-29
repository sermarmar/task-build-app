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
import { ColorPicker } from "../../../components/ux/ColorPicker";
import { useColorAlpha } from "../../../hooks/useColorAlpha";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";

interface ModalFormCategoryProps {
    show: boolean;
    isEdit?: boolean;
    category?: Category | null;
    onClose: () => void;
}

export const ModalFormCategory: React.FC<ModalFormCategoryProps> = ({ show, isEdit, category, onClose }) => {

    const [visible, setVisible] = useState(show);
    const { notify } = useNotification();

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CategoryRequest>({
        defaultValues: {
            name: '',
            description: '',
            color: '#1d5f47',
            icon: 'Star'
        }
    });

    // 👇 watch para sincronizar la preview en tiempo real
    const watchedName = watch("name");
    const watchedDescription = watch("description");
    const watchedIcon = watch("icon");
    const watchedColor = watch("color");

    // 👇 useColorAlpha ahora en el cuerpo del componente, no dentro del JSX
    const previewBg = useColorAlpha(watchedColor, 0.2);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    // 👇 Si es edición, precarga los valores de la categoría
    useEffect(() => {
        if (isEdit && category) {
            reset({
                name: category.name ?? '',
                description: category.description ?? '',
                color: category.color ?? '#1d5f47',
                icon: category.icon ?? 'Star',
            });
        } else {
            reset({
                name: '',
                description: '',
                color: '#1d5f47',
                icon: 'Star',
            });
        }
    }, [isEdit, category, reset]);

    if (!visible) return null;

    const handleCreateCategory = async (form: CategoryRequest) => {
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
                        {errors.name && (
                            <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
                        )}
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
                        {/* 👇 IconsList necesita notificar al form cuando el usuario elige un icono */}
                        <IconsList
                            selected={watchedIcon}
                            onSelect={(iconName) => setValue("icon", iconName)}
                        />
                    </div>
                    <div>
                        <Button type="button">Escoge un color</Button>
                        {/* 👇 ColorPicker necesita notificar al form cuando cambia el color */}
                        <ColorPicker
                            showHslValues={false}
                            value={watchedColor}
                            onChange={(newColor) => setValue("color", newColor)}
                        />
                    </div>

                    {/* Preview en tiempo real */}
                    <div
                        className="flex gap-4 items-center p-4 rounded-md border-l-5 w-full"
                        style={{
                            backgroundColor: previewBg,
                            borderColor: watchedColor,
                        }}
                    >
                        <span
                            className="text-tertiary-50 w-10 h-10 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: watchedColor }}
                        >
                            <DynamicIcon name={watchedIcon} />
                        </span>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-md font-bold">
                                {watchedName || "Nombre de categoría"}
                            </h3>
                            <h5 className="text-sm text-secondary-800">
                                {watchedDescription || "Descripción de la categoría"}
                            </h5>
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