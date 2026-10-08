import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip, type ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { Card } from "@/app/components/ux/Card";
import { Skeleton } from "@/app/components/ux/Skeleton";
import { cn } from "@/utils/cn";
import { useWeeklyActivity } from "../hooks/useWeeklyActivity";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

// Canvas no entiende var(--...): se leen los colores del tema ya resueltos
const readThemeColor = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

interface SeriesSwitchProps {
    label: string;
    color: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const SeriesSwitch: React.FC<SeriesSwitchProps> = ({ label, color, checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex items-center gap-2 text-sm font-bold text-primary-600 cursor-pointer"
    >
        {label}
        <span
            className={cn("relative w-10 h-6 rounded-full shadow-clay-inset transition-colors", !checked && "bg-primary-100")}
            style={checked ? { backgroundColor: `${color}55` } : undefined}
        >
            <span
                className={cn("absolute top-1 size-4 rounded-full shadow-clay-sm transition-all", checked ? "left-5" : "left-1 bg-white")}
                style={checked ? { backgroundColor: color } : undefined}
            />
        </span>
    </button>
);

export const WeeklyActivityChart: React.FC = () => {
    const { weekly, isLoading } = useWeeklyActivity();
    const [visible, setVisible] = useState({ habits: true, tasks: true });

    const theme = useMemo(() => ({
        habits: readThemeColor('--color-tertiary-500'),
        tasks: readThemeColor('--color-secondary-500'),
        ink: readThemeColor('--color-primary-950'),
        muted: readThemeColor('--color-primary-400'),
        grid: readThemeColor('--color-primary-100'),
    }), []);

    const series = [
        { key: 'habits' as const, label: 'Hábitos', color: theme.habits, data: weekly?.habits ?? [] },
        { key: 'tasks' as const,  label: 'Tareas',  color: theme.tasks,  data: weekly?.tasks ?? [] },
    ];

    const total = (weekly?.habits.reduce((a, b) => a + b, 0) ?? 0) + (weekly?.tasks.reduce((a, b) => a + b, 0) ?? 0);

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: theme.ink,
                bodyColor: theme.ink,
                borderColor: theme.grid,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 14,
                usePointStyle: true,
                boxPadding: 6,
                titleFont: { family: 'Nunito', weight: 'bold' },
                bodyFont: { family: 'Nunito' },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: theme.muted, font: { family: 'Nunito', weight: 'bold', size: 11 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: theme.grid },
                border: { display: false },
                ticks: { color: theme.muted, precision: 0, font: { family: 'Nunito', weight: 'bold', size: 11 } },
            },
        },
        elements: {
            line: { tension: 0.42, borderWidth: 3, borderCapStyle: 'round' },
            point: { radius: 0, hoverRadius: 7, hoverBorderWidth: 3, hoverBackgroundColor: '#ffffff' },
        },
    };

    const data = {
        labels: weekly?.labels ?? [],
        datasets: series.map(s => ({
            label: s.label,
            data: s.data,
            borderColor: s.color,
            backgroundColor: s.color,
            pointHoverBorderColor: s.color,
            hidden: !visible[s.key],
        })),
    };

    const tabTitle = (
        <>
            <TrendingUp />
            Actividad semanal
        </>
    );

    const tabActions = (
        <div className="hidden md:flex items-center gap-5">
            {series.map(s => (
                <SeriesSwitch
                    key={s.key}
                    label={s.label}
                    color={s.color}
                    checked={visible[s.key]}
                    onChange={(checked) => setVisible(prev => ({ ...prev, [s.key]: checked }))}
                />
            ))}
        </div>
    );

    return (
        <Card
            tabTitle={tabTitle}
            tabSubtitle={isLoading ? 'Cargando actividad…' : `${total} completados en las últimas 10 semanas`}
            tabActions={tabActions}
        >
            {isLoading ? (
                <Skeleton className="h-72 rounded-3xl" />
            ) : (
                <>
                    <div className="h-72">
                        <Line options={options} data={data} />
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {series.map(s => (
                            <span key={s.key} className="flex items-center gap-2 text-sm font-bold text-primary-600">
                                <span className="size-3 rounded-full" style={{ backgroundColor: s.color }} />
                                {s.label}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </Card>
    );
};
