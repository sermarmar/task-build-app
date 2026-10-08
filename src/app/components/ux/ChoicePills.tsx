import { cn } from "@/utils/cn";

interface ChoiceOption<T extends string | number> {
    value: T;
    label: React.ReactNode;
}

interface ChoicePillsProps<T extends string | number> {
    options: ChoiceOption<T>[];
    value: T | null;
    onChange: (value: T | null) => void;
    ariaLabel: string;
    round?: boolean;
    className?: string;
}

// Radiogroup en píldoras; pulsar la opción activa la deselecciona (los campos son opcionales)
export const ChoicePills = <T extends string | number>({ options, value, onChange, ariaLabel, round = false, className }: ChoicePillsProps<T>) => (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("flex flex-wrap gap-2", className)}>
        {options.map((option) => {
            const active = option.value === value;
            return (
                <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onChange(active ? null : option.value)}
                    className={cn(
                        "font-bold text-sm transition-all cursor-pointer",
                        round ? "size-10 rounded-full flex items-center justify-center" : "rounded-full px-4 py-2",
                        active
                            ? "clay-peach text-white shadow-clay-pressed"
                            : "bg-surface text-primary-500 shadow-clay-sm hover:text-primary-800",
                    )}
                >
                    {option.label}
                </button>
            );
        })}
    </div>
);
