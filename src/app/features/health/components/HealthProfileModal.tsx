import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Brain, Check, MoonStar, Ruler, Save, X } from "lucide-react";
import { Modal } from "@/app/components/ux/Modal";
import { Input } from "@/app/components/ux/Input";
import { Button } from "@/app/components/ux/Button";
import { Checkbox } from "@/app/components/ux/Checkbox";
import { ChoicePills } from "@/app/components/ux/ChoicePills";
import { useNotification } from "@/app/contexts/notification/useNotification";
import type { ErrorMessage } from "@/app/shared/Error";
import { ACTIVITY_LEVELS, EMPTY_HEALTH_PROFILE, SEX_OPTIONS, type HealthProfile } from "../models/HealthProfile";
import { HealthMetricsService } from "../services/HealthMetricsService";
import { formatHours, formatNumber, isFilled } from "../helpers/formatters";
import { cn } from "@/utils/cn";

interface HealthProfileModalProps {
    show: boolean;
    onClose: () => void;
    profile: HealthProfile;
    birthDate?: string | null;
    isSaving: boolean;
    onSave: (values: HealthProfile) => Promise<{ error: ErrorMessage | null }>;
}

const SCALE_OPTIONS = [1, 2, 3, 4, 5].map(n => ({ value: n, label: n }));

const Panel: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className }) => (
    <fieldset className={cn("rounded-3xl bg-white/40 shadow-clay-inset p-5 flex flex-col gap-4 min-w-0", className)}>
        <legend className="sr-only">{title}</legend>
        <h3 aria-hidden="true" className="flex items-center gap-2 font-heading font-bold text-primary-900 [&_svg]:size-5 [&_svg]:text-tertiary-500">
            {icon}{title}
        </h3>
        {children}
    </fieldset>
);

const FieldLabel: React.FC<{ children: React.ReactNode; hint?: React.ReactNode }> = ({ children, hint }) => (
    <div className="flex items-baseline justify-between gap-2 mb-2">
        <p className="text-sm font-bold text-primary-800">{children}</p>
        {hint && <span className="text-xs text-primary-400">{hint}</span>}
    </div>
);

const PreviewChip: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <span className="flex items-baseline gap-1.5 rounded-full bg-surface shadow-clay-sm px-4 py-1.5 text-sm">
        <span className="font-bold text-primary-400">{label}</span>
        <span className="font-heading font-bold text-primary-950">{value}</span>
    </span>
);

export const HealthProfileModal: React.FC<HealthProfileModalProps> = ({ show, onClose, profile, birthDate, isSaving, onSave }) => {
    const { notify } = useNotification();
    const { register, control, handleSubmit, reset, watch } = useForm<HealthProfile>({ defaultValues: EMPTY_HEALTH_PROFILE });

    // Cada vez que se abre parte de lo guardado: descarta cambios a medias de una apertura anterior
    useEffect(() => {
        if (show) reset(profile);
    }, [show, profile, reset]);

    const values = watch();
    const metrics = HealthMetricsService.getMetrics(values, birthDate);
    const sleepBelowGoal = metrics.sleepHours !== null && isFilled(values.sleepGoalHours) && metrics.sleepHours < values.sleepGoalHours;

    const onSubmit = async (form: HealthProfile) => {
        const { error } = await onSave(form);
        if (error) {
            notify(<><X /><span>{error.message}.</span></>, 'danger');
            return;
        }
        notify(<><Check /><span>Datos de salud guardados.</span></>, 'success');
        onClose();
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Tus datos de salud"
            subtitle="Solo tú puedes verlos. Los cálculos se actualizan mientras escribes."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                    <PreviewChip label="IMC" value={metrics.bmi ? formatNumber(metrics.bmi) : '—'} />
                    <PreviewChip label="Agua" value={metrics.waterLiters ? `${formatNumber(metrics.waterLiters)} L` : '—'} />
                    <PreviewChip label="Calorías" value={metrics.dailyCalories ? `${formatNumber(metrics.dailyCalories, 0)} kcal` : '—'} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Panel icon={<Ruler />} title="Cuerpo">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Input label="Altura" type="number" suffix="cm" min={50} max={260} step={0.1} placeholder="170"
                                    {...register('heightCm', { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Input label="Peso" type="number" suffix="kg" min={20} max={400} step={0.1} placeholder="65"
                                    {...register('weightKg', { valueAsNumber: true })} />
                            </div>
                        </div>
                        <div>
                            <Input label="Peso objetivo" type="number" suffix="kg" min={20} max={400} step={0.1} placeholder="Opcional"
                                {...register('targetWeightKg', { valueAsNumber: true })} />
                        </div>
                        <div>
                            <FieldLabel hint="Para estimar calorías">Sexo</FieldLabel>
                            <Controller name="sex" control={control} render={({ field }) => (
                                <ChoicePills ariaLabel="Sexo" options={SEX_OPTIONS} value={field.value} onChange={field.onChange} />
                            )} />
                        </div>
                        <div>
                            <FieldLabel>Nivel de actividad</FieldLabel>
                            <Controller name="activityLevel" control={control} render={({ field }) => (
                                <ChoicePills ariaLabel="Nivel de actividad" options={ACTIVITY_LEVELS} value={field.value} onChange={field.onChange} />
                            )} />
                        </div>
                    </Panel>

                    <Panel icon={<MoonStar />} title="Descanso e hidratación">
                        <div>
                            <Input label="Horas de sueño objetivo" type="number" suffix="h" min={3} max={14} step={0.5} placeholder="8"
                                {...register('sleepGoalHours', { valueAsNumber: true })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Input label="Me acuesto" type="time" {...register('bedtime')} />
                            </div>
                            <div>
                                <Input label="Me levanto" type="time" {...register('wakeTime')} />
                            </div>
                        </div>
                        {metrics.sleepHours !== null && (
                            <p className="text-sm text-primary-500 -mt-1">
                                Con este horario duermes <strong className="text-primary-800">{formatHours(metrics.sleepHours)}</strong>
                                {sleepBelowGoal && <span className="text-tertiary-700">, por debajo de tu objetivo</span>}.
                            </p>
                        )}
                        <div>
                            <Input label="Agua al día" type="number" suffix="L" min={0.5} max={8} step={0.1} placeholder="2"
                                {...register('waterGoalLiters', { valueAsNumber: true })} />
                        </div>
                    </Panel>

                    <Panel icon={<Brain />} title="Bienestar mental" className="lg:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel hint="1 bajo · 5 alto">Estrés habitual</FieldLabel>
                                <Controller name="stressLevel" control={control} render={({ field }) => (
                                    <ChoicePills ariaLabel="Estrés habitual" round options={SCALE_OPTIONS} value={field.value} onChange={field.onChange} />
                                )} />
                            </div>
                            <div>
                                <FieldLabel hint="1 baja · 5 alta">Energía habitual</FieldLabel>
                                <Controller name="energyLevel" control={control} render={({ field }) => (
                                    <ChoicePills ariaLabel="Energía habitual" round options={SCALE_OPTIONS} value={field.value} onChange={field.onChange} />
                                )} />
                            </div>
                            <Controller name="practicesMeditation" control={control} render={({ field }) => (
                                <Checkbox label="Practico meditación o mindfulness" checked={field.value} onChange={field.onChange} />
                            )} />
                            <Controller name="attendsTherapy" control={control} render={({ field }) => (
                                <Checkbox label="Tengo apoyo psicológico o voy a terapia" checked={field.value} onChange={field.onChange} />
                            )} />
                        </div>
                        {(values.stressLevel ?? 0) >= 4 && !values.attendsTherapy && (
                            <p className="text-sm text-primary-500 rounded-2xl bg-lilac-100 px-4 py-3">
                                Si el estrés se mantiene alto durante semanas, hablar con un profesional puede ayudarte.
                            </p>
                        )}
                    </Panel>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-primary-400 max-w-md">
                        Los cálculos son orientativos y no sustituyen el consejo de un profesional sanitario.
                    </p>
                    <Button type="submit" color="tertiary" form="rounded" size="lg" disabled={isSaving} className="justify-center">
                        <Save size={18} />
                        {isSaving ? 'Guardando…' : 'Guardar cambios'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
