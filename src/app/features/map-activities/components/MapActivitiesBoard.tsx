import { useEffect, useRef, useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ActivityGrid } from '../models/MapActivity';
import { Card } from '@/app/components/ux/Card';
import { ActivityCell } from './ActivityCell';
import { Legend } from './Legend';
import { Skeleton } from '@/app/components/ux/Skeleton';

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MAX_SCALE = 1.5;

interface MapActivitiesBoardProps {
    grid: ActivityGrid | null;
    loading: boolean;
}

export const MapActivitiesBoard: React.FC<MapActivitiesBoardProps> = ({ grid, loading }) => {
    const [scale, setScale] = useState(1);
    const [gridNaturalHeight, setGridNaturalHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!grid || !containerRef.current || !gridRef.current) return;

        const update = () => {
            const containerWidth = containerRef.current!.offsetWidth;
            const gridWidth = gridRef.current!.scrollWidth;
            setScale(Math.min(containerWidth / gridWidth, MAX_SCALE));
            setGridNaturalHeight(gridRef.current!.offsetHeight);
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [grid]);

    const tabTitle = (
        <>
            <CalendarRange />
            Mapa de actividades
        </>
    );

    const subtitle = loading
        ? 'Cargando actividad…'
        : `${grid?.totalCount ?? 0} actividades en el último año`;

    return (
        <Card tabTitle={tabTitle} tabSubtitle={subtitle} tabActions={<Legend />} className="flex flex-col justify-center">
            {loading && (
                <div className="flex gap-1 pt-2">
                    {Array.from({ length: 40 }).map((_, wi) => (
                        <div key={wi} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, di) => (
                                <Skeleton key={di} className="size-3.5 rounded-[4px]" />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {!loading && grid && (
                <div ref={containerRef} className="w-full">
                    <div
                        ref={gridRef}
                        className="flex gap-1 min-w-max"
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            marginBottom: `${gridNaturalHeight * (scale - 1)}px`,
                        }}
                    >
                        <div className="flex flex-col gap-1 pt-5 pr-1">
                            {DAYS_ES.map((day, i) => (
                                <div
                                    key={day}
                                    className={cn(
                                        'h-3 text-[9px] leading-3 font-bold text-primary-400 select-none',
                                        i % 2 !== 0 && 'invisible'
                                    )}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <div className="relative h-5 mb-0.5">
                                {grid.months.map((month) => (
                                    <span
                                        key={`${month.label}-${month.weekIndex}`}
                                        className="absolute text-[10px] font-bold text-primary-400 select-none"
                                        style={{ left: month.weekIndex * 16 }}
                                    >
                                        {month.label}
                                    </span>
                                ))}
                            </div>

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
            )}
        </Card>
    );
};
