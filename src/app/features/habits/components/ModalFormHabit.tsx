import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardTitle } from "../../../components/ux/Card";
import { Input } from "../../../components/ux/Input";
import { Button } from "../../../components/ux/Button";
import { Stars } from "../../../components/ux/Stars";
import { SelectCategory } from "../../../components/template/category/SelectCategory";
import { Controller, useForm } from "react-hook-form";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import type { Category } from "../../../core/models/Category";
import { useNotification } from "../../../contexts/notification/useNotification";
import type { HabitRequest } from "../resources/HabitRequest";
import { FrecuencyDays } from "../../../components/template/frecuency_days/FrecuencyDays";
import { CreateHabitService } from "../services/CreateHabitService";
import type { Habit } from "../models/Habit";

interface ModalFormHabitProps {
    show: boolean;
    isEdit?: boolean;
    habit?: Habit | null;
    onClose: () => void;
}

export const ModalFormHabit: React.FC<ModalFormHabitProps> = ({ show, isEdit, habit, onClose }) => {

    const [visible, setVisible] = useState(show);
    const [category, setCategory] = useState<Category | null>(null);
    const { notify } = useNotification();

    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<HabitRequest>({
        defaultValues: {
            title: '',
            points: 0,
            category_id: '',
            frecuency: '',
            options_monthly: [],
            options_weekly: []
        }
    });

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await CategoryService.getFirstCategory();
            setCategory(res.category);
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        reset({
            title: habit?.title || '',
            points: habit?.points || 0,
            category_id: habit?.category_id || category?.id || '',
            frecuency: habit?.frequency || '',
            options_monthly: habit?.custom_days || [],
            options_weekly: habit?.custom_days || []
        });
    }, [habit, category, reset]);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    if (!visible) return null;

    const handleCreateHabit = async (form: HabitRequest) => {
        const response = await CreateHabitService.create(form);

        if (response.error) {
            notifyMessage("danger", "Ha fallado al crear un hábito. Contactá con el administrador.", <X />);
        } else {
            notifyMessage("success", "Se ha creado nuevo hábito correctamente.", <Check />);
            onClose();
        }
    }

    const notifyMessage = (type: "success" | "danger", message: string, icon?: React.ReactElement) => {
        notify(
            <>
                { icon }
                <span>{ message }</span>
            </>,
            type
        )
    }

    const handleFrecuencyClick = (frequency: string, selectedOptions?: string[], selectedDays?: string[]) => {
        setValue('frecuency', frequency);
        if (frequency === 'weekly') {
            setValue('options_weekly', selectedOptions || []);
            setValue('options_monthly', []);
        } else if (frequency === 'monthly') {
            setValue('options_monthly', selectedDays || []);
            setValue('options_weekly', []);
        } else {
            setValue('options_weekly', []);
            setValue('options_monthly', []);
        }
    }

    return (
        <div
            id="modal-create-habit"
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
                    { isEdit ? "Editar hábito" : "Crear nuevo hábito" }
                    <X className="cursor-pointer" onClick={onClose} />
                </CardTitle>
                <form onSubmit={ handleSubmit(handleCreateHabit) } className="grid grid-cols-3 gap-5 mt-4">
                    <div>
                        <Input 
                            label="Nombre del hábito"
                            type="text"
                            placeholder="Escribe un título para un hábito"
                            {...register("title", { required: "El título es obligatorio" })}
                        />
                        {errors.title && (
                            <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>
                        )}
                    </div>
                    <div>
                        <SelectCategory onChange={(c) => setValue('category_id', habit?.category_id || c.id)}/> 
                    </div>
                    
                    <div className="mb-4">
                        <Controller
                            name="points"
                            control={control}
                            rules={{ min: { value: 1, message: 'Selecciona al menos 1 punto' } }}
                            render={({ field }) => (
                                <Stars
                                    label="Puntos de esfuerzos"
                                    points={field.value}
                                    onChange={(value: number) => field.onChange(value)}
                                />
                            )}
                        />
                        {errors.points && (
                            <span className="text-red-500 text-sm">{errors.points.message}</span>
                        )}
                    </div>
                    <div className="col-span-3">
                        <FrecuencyDays onChange={handleFrecuencyClick} />
                    </div>
                    <div className="flex col-span-3 justify-end">
                        <Button type="submit">
                            { isEdit ? "Guardar cambios" : "Crear hábito" }
                        </Button> 
                    </div>
                </form>
            </Card>
        </div>
    );
}