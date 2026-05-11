import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RetrieveMapActivitiesService } from '../services/RetrieveMapActivitiesService';
import type { ActivityGrid } from '../models/MapActivity';
import { Card } from '@/app/components/ux/Card';
import { ActivityCell } from './ActivityCell';
import { Legend } from './Legend';

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const MapActivitiesBoard: React.FC = () => {
    const [grid, setGrid] = useState<ActivityGrid | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        RetrieveMapActivitiesService.getActivityGrid().then(({ grid }) => {
            setGrid(grid);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="w-5 h-5 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!grid) return null;

    const tabTitle = (
        <>
            Mapa de actividades
        </>
    );

    return (
        <Card className="flex flex-col gap-3" tabTitle={tabTitle}>
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-DEFAULT">
                    {grid.totalCount} actividades este año
                </h2>
                <Legend />
            </div>

            <div className="overflow-x-auto pb-1">
                <div className="flex gap-1 min-w-max">
                    {/* Day labels */}
                    <div className="flex flex-col gap-1 pt-5 pr-1">
                        {DAYS_ES.map((day, i) => (
                            <div
                                key={day}
                                className={cn(
                                    'h-3 text-[9px] leading-3 text-text-DEFAULT/40 select-none',
                                    i % 2 !== 0 && 'invisible'
                                )}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex flex-col gap-0.5">
                        {/* Month labels */}
                        <div className="relative h-5 mb-0.5">
                            {grid.months.map((month) => (
                                <span
                                    key={`${month.label}-${month.weekIndex}`}
                                    className="absolute text-[10px] text-text-DEFAULT/50 select-none"
                                    style={{ left: month.weekIndex * 16 }}
                                >
                                    {month.label}
                                </span>
                            ))}
                        </div>

                        {/* Weeks */}
                        <div className="flex gap-1">
                            {grid.weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-1">
                                    {week.days.map((day, di) => (
                                        <ActivityCell day={day} key={di} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
