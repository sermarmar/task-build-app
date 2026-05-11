import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RetrieveMapActivitiesService } from '../services/RetrieveMapActivitiesService';
import type { ActivityGrid } from '../models/MapActivity';
import { Card } from '@/app/components/ux/Card';
import { ActivityCell } from './ActivityCell';
import { Legend } from './Legend';
import { Skeleton, SkeletonLine } from '@/app/components/ux/Skeleton';

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const MapActivitiesBoard: React.FC = () => {
    const [grid, setGrid] = useState<ActivityGrid | null>(null);
    const [loading, setLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [gridNaturalHeight, setGridNaturalHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        RetrieveMapActivitiesService.getActivityGrid().then(({ grid }) => {
            setGrid(grid);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!grid || !containerRef.current || !gridRef.current) return;

        const update = () => {
            const containerWidth = containerRef.current!.offsetWidth;
            const gridWidth = gridRef.current!.scrollWidth;
            const naturalHeight = gridRef.current!.offsetHeight;
            const newScale = gridWidth > containerWidth ? containerWidth / gridWidth : 1;
            setScale(newScale);
            setGridNaturalHeight(naturalHeight);
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [grid]);

    if (loading) {
        return (
            <Card className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <SkeletonLine className="w-40" />
                    <Skeleton className="w-24 h-4 rounded" />
                </div>
                <div className="flex gap-1">
                    <div className="flex flex-col gap-1 pt-5 pr-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="w-6 h-3 rounded" />
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: 26 }).map((_, wi) => (
                            <div key={wi} className="flex flex-col gap-1 pt-5">
                                {Array.from({ length: 7 }).map((_, di) => (
                                    <Skeleton key={di} className="w-3 h-3 rounded-sm" />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
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

            <div ref={containerRef} className="w-full">
                <div
                    ref={gridRef}
                    className="flex gap-1 min-w-max"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        marginBottom: scale < 1 ? `${gridNaturalHeight * (scale - 1)}px` : undefined,
                    }}
                >
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
