import { cn } from "@/utils/cn";

interface SegmentedOption<T extends string> {
    value: T;
    label: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export const SegmentedControl = <T extends string>({ options, value, onChange, className }: SegmentedControlProps<T>) => (
    <div role="tablist" className={cn("inline-flex gap-1 p-1.5 rounded-full bg-white/40 shadow-clay-inset", className)}>
        {options.map((option) => {
            const active = option.value === value;
            return (
                <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all cursor-pointer [&_svg]:size-4",
                        active
                            ? "bg-surface text-primary-950 shadow-clay-sm [&_svg]:text-tertiary-500"
                            : "text-primary-500 hover:text-primary-800",
                    )}
                >
                    {option.label}
                </button>
            );
        })}
    </div>
);
