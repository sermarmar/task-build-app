import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Modal } from "../../../components/ux/Modal";
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
import { UpdateHabitService } from "../services/UpdateHabitService";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import type { Habit } from "../models/Habit";

interface ModalFormHabitProps {
    show: boolean;
    isEdit?: boolean;
    habit?: Habit | null;
    onClose: () => void;
}

export const ModalFormHabit: React.FC<ModalFormHabitProps> = ({ show, isEdit, habit, onClose }) => {

    const [category, setCategory] = useState<Category | null>(null);
    const { notify } = useNotification();
    const { refreshHabits } = useHabitBoardContext();

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
            options_monthly: habit?.custom_days?.map(String) || [],
            options_weekly: habit?.custom_days?.map(String) || []
        });
    }, [habit, category, reset]);

    const handleCreateHabit = async (form: HabitRequest) => {
        const response = isEdit && habit
            ? await UpdateHabitService.update(habit.id!, form)
            : await CreateHabitService.create(form);

        if (response.error) {
            notifyMessage("danger", isEdit ? "Ha fallado al editar el hábito." : "Ha fallado al crear un hábito.", <X />);
        } else {
            notifyMessage("success", isEdit ? "Hábito editado correctamente." : "Hábito creado correctamente.", <Check />);
            refreshHabits(true);
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
        <Modal
            show={show}
            onClose={onClose}
            title={isEdit ? "Editar hábito" : "Nuevo hábito"}
            subtitle="Los hábitos pequeños y constantes son los que más suman."
        >
            <form onSubmit={ handleSubmit(handleCreateHabit) } className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Input
                        label="Nombre del hábito"
                        type="text"
                        placeholder="Escribe un título para un hábito"
                        {...register("title", { required: "El título es obligatorio" })}
                    />
                    {errors.title && (
                        <span className="block text-accent-blossom-700 text-sm font-bold mt-1.5">{errors.title.message}</span>
                    )}
                </div>
                <div>
                    <SelectCategory value={habit?.category_id ?? undefined} onChange={(c) => c && setValue('category_id', c.id)} />
                </div>

                <div>
                    <Controller
                        name="points"
                        control={control}
                        rules={{ min: { value: 1, message: 'Selecciona al menos 1 punto' } }}
                        render={({ field }) => (
                            <Stars
                                label="Puntos de esfuerzo"
                                points={field.value}
                                onChange={(value: number) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.points && (
                        <span className="block text-accent-blossom-700 text-sm font-bold mt-1">{errors.points.message}</span>
                    )}
                </div>
                <div className="md:col-span-3 rounded-3xl bg-white/40 shadow-clay-inset p-5">
                    <p className="text-sm font-bold text-primary-800 mb-3">Frecuencia</p>
                    <FrecuencyDays
                        key={habit?.id ?? 'new'}
                        onChange={handleFrecuencyClick}
                        initialFrequency={habit?.frequency ?? ''}
                        initialOptions={habit?.frequency === 'weekly' ? (habit.custom_days ?? []) : []}
                        initialDays={habit?.frequency === 'custom' ? (habit.custom_days ?? []) : []}
                    />
                </div>
                <div className="flex md:col-span-3 justify-end">
                    <Button type="submit" color="tertiary" form="rounded" size="lg">
                        { isEdit ? "Guardar cambios" : "Crear hábito" }
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
