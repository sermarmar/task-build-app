import { useEffect, useState } from "react";
import type { Category } from "../../../core/models/Category";
import { useNotification } from "../../../contexts/notification/useNotification";
import { useForm } from "react-hook-form";
import type { CategoryRequest } from "../resources/CategoryRequest";
import { Card, CardTitle } from "../../../components/ux/Card";
import { Button } from "../../../components/ux/Button";
import { Input } from "../../../components/ux/Input";
import { X } from "lucide-react";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";
import { IconsList } from "./IconsList";


interface ModalFormCategoryProps {
    show: boolean;
    isEdit?: boolean;
    category?: Category | null;
    onClose: () => void;
}

export const ModalFormCategory: React.FC<ModalFormCategoryProps> = ({ show, isEdit, category, onClose }) => {

    const [visible, setVisible] = useState(show);
    const { notify } = useNotification();

    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<CategoryRequest>({
        defaultValues: {
            name: '',
            description: '',
            color: '#000000',
            icon: 'Star'
        }
    });

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    if (!visible) return null;

    const handleCreateCategory = async (form: CategoryRequest) => {
        // Aquí puedes agregar la lógica para crear o editar la categoría
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
                }`}/* prevent closing when clicking inside */
            >
                <CardTitle className="flex justify-between items-center">
                    { isEdit ? "Editar categoría" : "Crear nueva categoría" }
                    <X className="cursor-pointer" onClick={onClose} />
                </CardTitle>
                <form onSubmit={ handleSubmit(handleCreateCategory) } className="grid grid-cols-3 gap-5 mt-4">
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
                            placeholder="Escribe una descripción para una categoría"
                            {...register("name", { required: "El nombre es obligatorio" })}
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <IconsList />
                    </div>
                    <div className="flex col-span-3 justify-end">
                        <Button type="submit">
                            { isEdit ? "Guardar cambios" : "Crear categoría" }
                        </Button> 
                    </div>
                </form>
            </Card>
        </div>
    );
}