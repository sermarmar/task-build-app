import { Sprout } from "lucide-react";
import { Card } from "@/app/components/ux/Card";
import { Skeleton } from "@/app/components/ux/Skeleton";

interface MentalHealthBoardProps {
    balance: number;
    isLoading: boolean;
}

const ARC = "M 24 150 A 116 116 0 0 1 256 150";

export const MentalHealthBoard: React.FC<MentalHealthBoardProps> = ({ balance, isLoading }) => {

    const tabTitle = (
        <>
            <Sprout />
            Salud mental
        </>
    );

    return (
        <Card tabTitle={tabTitle} tabSubtitle="Equilibrio entre tus áreas este mes" className="flex items-center justify-center">
            {isLoading ? (
                <Skeleton className="w-64 h-36 rounded-t-full" />
            ) : (
                <div className="relative w-full max-w-[280px]">
                    <svg viewBox="0 0 280 172" className="w-full overflow-visible" role="img" aria-label={`Balance de salud mental: ${balance}%`}>
                        <defs>
                            <linearGradient id="mental-health-gauge" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="var(--color-accent-blossom-400)" />
                                <stop offset="100%" stopColor="var(--color-tertiary-300)" />
                            </linearGradient>
                        </defs>
                        <path d={ARC} fill="none" stroke="var(--color-cream-100)" strokeWidth="30" strokeLinecap="round" />
                        <path
                            d={ARC}
                            fill="none"
                            stroke="url(#mental-health-gauge)"
                            strokeWidth="30"
                            strokeLinecap="round"
                            pathLength={100}
                            strokeDasharray={`${balance} 100`}
                            style={{ transition: 'stroke-dasharray 0.6s ease' }}
                        />
                        <text x="24" y="172" textAnchor="middle" className="fill-primary-400 text-[11px] font-bold">0%</text>
                        <text x="256" y="172" textAnchor="middle" className="fill-primary-400 text-[11px] font-bold">100%</text>
                    </svg>
                    <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-1">
                        <span className="size-12 rounded-full clay-knob flex items-center justify-center text-tertiary-500">
                            <Sprout size={22} />
                        </span>
                        <span className="font-heading text-4xl font-bold text-primary-950">{balance}%</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
