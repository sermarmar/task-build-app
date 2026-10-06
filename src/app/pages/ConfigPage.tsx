import { useState } from 'react';
import { Layers, ListChecks, SlidersHorizontal, Tags } from 'lucide-react';
import { Card } from '../components/ux/Card';
import { PageHeader } from '../components/template/PageHeader';
import { CategoryBoard } from '../features/category/components/CategoryBoard';
import { CategoryBoardProvider } from '../features/category/contexts/CategoryBoardProvider';
import { GroupBoard } from '../features/group/components/GroupBoard';
import { cn } from '@/utils/cn';

type ConfigSection = 'groups' | 'categories' | 'states' | 'general';

const MENU_OPTIONS: { value: ConfigSection; label: string; description: string; icon: React.ReactNode }[] = [
    { value: 'groups',     label: 'Grupos',     description: 'Colores de tus áreas',   icon: <Layers />            },
    { value: 'categories', label: 'Categorías', description: 'Iconos y agrupación',    icon: <Tags />              },
    { value: 'states',     label: 'Estados',    description: 'Flujo de tus tareas',    icon: <ListChecks />        },
    { value: 'general',    label: 'General',    description: 'Preferencias de la app', icon: <SlidersHorizontal /> },
];

const PendingSection: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
    <Card tabTitle={<>{icon}{title}</>}>
        <div className="rounded-3xl bg-white/40 shadow-clay-inset p-10 text-center">
            <p className="font-bold text-primary-500">Esta sección todavía está en desarrollo.</p>
        </div>
    </Card>
);

export const ConfigPage: React.FC = () => {
    const [section, setSection] = useState<ConfigSection>('groups');
    const current = MENU_OPTIONS.find(o => o.value === section)!;

    return (
        <div className="flex flex-col gap-8 pb-4">
            <PageHeader title="Configuración" subtitle="Personaliza tu experiencia ajustando las opciones del sistema." />

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
                <Card withPadding={false} className="p-3 lg:sticky lg:top-0">
                    <nav aria-label="Secciones de configuración">
                        <ul className="flex lg:flex-col gap-2 overflow-x-auto">
                            {MENU_OPTIONS.map(option => {
                                const active = option.value === section;
                                return (
                                    <li key={option.value} className="shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setSection(option.value)}
                                            aria-current={active ? 'page' : undefined}
                                            className={cn(
                                                "w-full flex items-center gap-3 rounded-2xl p-2.5 pr-4 text-left transition-all cursor-pointer",
                                                active ? "bg-white shadow-clay-sm" : "hover:bg-white/60",
                                            )}
                                        >
                                            <span className={cn(
                                                "size-10 rounded-xl flex items-center justify-center shrink-0 [&_svg]:size-5",
                                                active ? "clay-peach text-white shadow-clay-pressed" : "bg-primary-50 text-primary-400",
                                            )}>
                                                {option.icon}
                                            </span>
                                            <span>
                                                <span className={cn("block font-bold", active ? "text-primary-950" : "text-primary-700")}>{option.label}</span>
                                                <span className="hidden lg:block text-xs text-primary-400">{option.description}</span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </Card>

                <div className="min-w-0">
                    {section === 'groups' && <GroupBoard />}
                    {section === 'categories' && (
                        <CategoryBoardProvider>
                            <CategoryBoard />
                        </CategoryBoardProvider>
                    )}
                    {(section === 'states' || section === 'general') && (
                        <PendingSection title={current.label} icon={current.icon} />
                    )}
                </div>
            </div>
        </div>
    );
}
