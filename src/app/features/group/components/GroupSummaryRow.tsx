import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ux/Button";
import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { Skeleton } from "@/app/components/ux/Skeleton";
import { useGroupSummary } from "../hooks/useGroupSummary";

export const GroupSummaryRow: React.FC = () => {
    const { groups, isLoading } = useGroupSummary();
    const navigate = useNavigate();

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-heading text-xl font-bold text-primary-950">Tus áreas de bienestar</h2>
                <Button type="button" color="light" form="rounded" size="sm" onClick={() => navigate('/settings')}>
                    Configurar
                    <ArrowRight size={16} />
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-3xl" />)
                    : groups.map(group => (
                        <article key={group.id} className="flex items-center gap-4 rounded-3xl bg-surface shadow-clay p-4">
                            <span
                                className="size-14 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-clay-pressed [&_svg]:size-7"
                                style={{ background: `linear-gradient(160deg, ${group.color}aa, ${group.color})` }}
                            >
                                <DynamicIcon name={group.icon} />
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-heading font-bold text-primary-950 truncate">{group.name}</h3>
                                <p className="text-sm text-primary-500">
                                    {group.habits} {group.habits === 1 ? 'hábito' : 'hábitos'} · {group.categories} {group.categories === 1 ? 'categoría' : 'categorías'}
                                </p>
                            </div>
                        </article>
                    ))
                }
            </div>
        </section>
    );
};
